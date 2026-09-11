package com.model.backend_lang.exception;

public class InvalidWebhookSecretException extends RuntimeException {
    public InvalidWebhookSecretException(String message) {
        super(message);
    }
}
