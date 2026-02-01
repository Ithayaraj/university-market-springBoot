import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SellProductPage from './pages/SellProductPage';
import MyProductsPage from './pages/MyProductsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { user, loading } = useAuth();
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`font-sans antialiased text-gray-900 dark:text-gray-100 bg-slate-50 dark:bg-slate-950 min-h-screen selection:bg-primary selection:text-white transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        <Navbar />
        <Routes>
          {/* Initial logic: If not logged in, "/" shows LoginPage. If logged in, it shows HomePage */}
          <Route path="/" element={user ? <HomePage /> : <LoginPage />} />

          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />

          {/* Protected Routes */}
          <Route path="/product/:id" element={user ? <ProductDetailsPage /> : <Navigate to="/" />} />
          <Route path="/sell" element={user ? <SellProductPage /> : <Navigate to="/" />} />
          <Route path="/my-products" element={user ? <MyProductsPage /> : <Navigate to="/" />} />
          <Route path="/messages" element={user ? <MessagesPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

