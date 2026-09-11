package com.model.backend_lang;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.backend_lang.dto.AuthResponse;
import com.model.backend_lang.dto.CheckoutRequest;
import com.model.backend_lang.dto.CheckoutResponse;
import com.model.backend_lang.dto.LoginRequest;
import com.model.backend_lang.dto.RegisterRequest;
import com.model.backend_lang.dto.WebhookPayload;
import com.model.backend_lang.model.SubscriptionStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.model.backend_lang.repository.PaymentRepository;
import com.model.backend_lang.repository.UserProgressRepository;
import com.model.backend_lang.repository.UserRepository;
import org.junit.jupiter.api.BeforeAll;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class LmsIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${app.payment.webhook-secret}")
    private String webhookSecret;

    private static String jwtToken;
    private static String transactionId;
    private static final String TEST_EMAIL = "teststudent@example.com";
    private static final String TEST_PASSWORD = "Password123!";

    @BeforeAll
    static void initDatabase(
            @Autowired UserRepository userRepository,
            @Autowired PaymentRepository paymentRepository,
            @Autowired UserProgressRepository userProgressRepository
    ) {
        userRepository.findByEmail(TEST_EMAIL).ifPresent(user -> {
            paymentRepository.deleteAll(paymentRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
            userProgressRepository.deleteAll(userProgressRepository.findAllByUserId(user.getId()));
            userRepository.delete(user);
        });
    }

    @Test
    @Order(1)
    @DisplayName("1. Register new user with FREE status")
    void testRegisterUser() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email(TEST_EMAIL)
                .password(TEST_PASSWORD)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(TEST_EMAIL))
                .andExpect(jsonPath("$.subscriptionStatus").value(SubscriptionStatus.FREE.name()));
    }

    @Test
    @Order(2)
    @DisplayName("2. Login user and obtain JWT")
    void testLoginUser() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email(TEST_EMAIL)
                .password(TEST_PASSWORD)
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.subscriptionStatus").value(SubscriptionStatus.FREE.name()))
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        jwtToken = authResponse.getToken();
    }

    @Test
    @Order(3)
    @DisplayName("3. List courses publicly without auth")
    void testListCoursesPublic() throws Exception {
        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].language").value("Language & Writing"))
                .andExpect(jsonPath("$[0].freeLessonsCount").value(2));
    }

    @Test
    @Order(4)
    @DisplayName("4. List course lessons: Paid lessons are locked and stripped of video_url for FREE user")
    void testListCourseLessonsFreeUser() throws Exception {
        mockMvc.perform(get("/api/courses/1/lessons")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                // Free lessons have videoUrl and isLocked = false
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].free").value(true))
                .andExpect(jsonPath("$[0].locked").value(false))
                .andExpect(jsonPath("$[0].videoUrl").isNotEmpty())
                // Paid lessons have isLocked = true and videoUrl = null
                .andExpect(jsonPath("$[2].id").value(3))
                .andExpect(jsonPath("$[2].free").value(false))
                .andExpect(jsonPath("$[2].locked").value(true))
                .andExpect(jsonPath("$[2].videoUrl").isEmpty());
    }

    @Test
    @Order(5)
    @DisplayName("5. Access free lesson: Returns 200 with video_url")
    void testAccessFreeLesson() throws Exception {
        mockMvc.perform(get("/api/lessons/1")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.free").value(true))
                .andExpect(jsonPath("$.videoUrl").value("https://www.youtube.com/watch?v=6p9Il_j0zjc"));
    }

    @Test
    @Order(6)
    @DisplayName("6. Access paid lesson as FREE user: Blocked with 403 Forbidden")
    void testAccessPaidLessonAsFreeUserBlocked() throws Exception {
        mockMvc.perform(get("/api/lessons/3")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Subscription Required"))
                .andExpect(jsonPath("$.message").value(containsString("Subscription required to access this lesson")));
    }

    @Test
    @Order(7)
    @DisplayName("7. Complete a lesson and verify progress")
    void testCompleteLesson() throws Exception {
        mockMvc.perform(post("/api/progress/1/complete")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonId").value(1))
                .andExpect(jsonPath("$.completed").value(true))
                .andExpect(jsonPath("$.lastWatchedAt").isNotEmpty());

        mockMvc.perform(get("/api/progress/courses/1")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalLessons").value(4))
                .andExpect(jsonPath("$.completedLessons").value(1))
                .andExpect(jsonPath("$.completionPercentage").value(25.0))
                .andExpect(jsonPath("$.completedLessonIds", hasItem(1)));
    }

    @Test
    @Order(8)
    @DisplayName("8. Initiate paywall checkout")
    void testInitiateCheckout() throws Exception {
        CheckoutRequest request = CheckoutRequest.builder()
                .plan("PRO_MONTHLY")
                .build();

        MvcResult result = mockMvc.perform(post("/api/payments/checkout")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionId").isNotEmpty())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        CheckoutResponse checkoutResponse = objectMapper.readValue(result.getResponse().getContentAsString(), CheckoutResponse.class);
        transactionId = checkoutResponse.getTransactionId();
    }

    @Test
    @Order(9)
    @DisplayName("9. Webhook: Reject unauthorized webhook attempt without secret key")
    void testWebhookUnauthorizedWithoutSecret() throws Exception {
        WebhookPayload payload = WebhookPayload.builder()
                .transactionId(transactionId)
                .status("SUCCESS")
                .build();

        mockMvc.perform(post("/api/payments/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @Order(10)
    @DisplayName("10. Webhook: Successfully process payment and upgrade user to PRO")
    void testWebhookSuccessUpgradesUser() throws Exception {
        WebhookPayload payload = WebhookPayload.builder()
                .transactionId(transactionId)
                .status("SUCCESS")
                .build();

        mockMvc.perform(post("/api/payments/webhook")
                        .header("X-Webhook-Secret", webhookSecret)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").value(transactionId))
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        // Verify current user profile reflects PRO
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subscriptionStatus").value(SubscriptionStatus.PRO.name()));
    }

    @Test
    @Order(11)
    @DisplayName("11. Access paid lesson after PRO upgrade: Returns 200 OK with video_url")
    void testAccessPaidLessonAfterProUpgrade() throws Exception {
        mockMvc.perform(get("/api/lessons/3")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.free").value(false))
                .andExpect(jsonPath("$.videoUrl").value(containsString("JapaneseKanjiRadicalsMastery")));
    }

    @Test
    @Order(12)
    @DisplayName("12. Course lessons endpoint now includes all video_urls for PRO user")
    void testCourseLessonsAllUnlockedForProUser() throws Exception {
        mockMvc.perform(get("/api/courses/1/lessons")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[2].id").value(3))
                .andExpect(jsonPath("$[2].locked").value(false))
                .andExpect(jsonPath("$[2].videoUrl").value(containsString("JapaneseKanjiRadicalsMastery")));
    }

    @Test
    @Order(13)
    @DisplayName("13. Payment history: Returns user transaction history")
    void testPaymentHistory() throws Exception {
        mockMvc.perform(get("/api/payments/history")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].transactionId").value(transactionId))
                .andExpect(jsonPath("$[0].status").value("SUCCESS"));
    }
}
