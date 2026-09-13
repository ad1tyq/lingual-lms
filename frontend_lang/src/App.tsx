import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PaywallModal } from './components/PaywallModal';
import { LandingPage } from './pages/LandingPage';
import { CourseCatalog } from './pages/CourseCatalog';
import { CourseDetail } from './pages/CourseDetail';
import { Classroom } from './pages/Classroom';
import { LoginPage } from './pages/LoginPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';

const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ModalProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <PageTransitionWrapper>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/languages/:languageId" element={<CourseCatalog />} />
                <Route path="/courses" element={<Navigate to="/languages/japanese" replace />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/courses/:courseId/lessons/:lessonId" element={<Classroom />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageTransitionWrapper>
            <Footer />
            <PaywallModal />
          </div>
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
