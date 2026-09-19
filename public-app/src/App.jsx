import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import LoginPage from './pages/LoginPage';
import PublicLayout from './pages/PublicLayout';
import PublicHome from './pages/PublicHome';
import { GlobalStyles } from './theme/GlobalStyles';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <AuthProvider>
          <LocationProvider>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<PublicHome />} />
              
              {/* Active Public Safety Portal Routes */}
              <Route path="/public/*" element={<PublicLayout />} />

              {/* Convenient Public URL Aliases */}
              <Route path="/profile" element={<Navigate to="/public/profile" replace />} />
              <Route path="/map" element={<Navigate to="/public/map" replace />} />
              <Route path="/alerts" element={<Navigate to="/public/alerts" replace />} />
              <Route path="/safety" element={<Navigate to="/public/safety" replace />} />
              <Route path="/emergency" element={<Navigate to="/public/emergency" replace />} />
              <Route path="/risks" element={<Navigate to="/public/risks" replace />} />
              <Route path="/status" element={<Navigate to="/public/status" replace />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ChatbotWidget />
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
