import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/navbar';
import Home from './components/Home/Home';
import Hero from './components/hero/hero';
// import CardGrid from './components/Card grid/CardGrid';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/login';
import Footer from './components/Footer/footer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/firebase/config';
import Loader from './components/Loader/Loader';
import PaymentPage from './components/Payment Page/PaymentPage';
import { CartProvider } from './Contexts/CartContext';

function ProtectedRoute({ children, isAdmin, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAdmin = () => {
      if (user) {
        setIsAdmin(user.email && user.email.toLowerCase() === 'admin@gmail.com');
      } else {
        setIsAdmin(false);
      }
      setChecking(false);
    };

    if (!loading) verifyAdmin();
  }, [user, loading]);

  if (checking || loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  {/* <CardGrid /> */}
                  <Home />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/checkout" element={<PaymentPage />} />
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute user={user} isAdmin={isAdmin}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
