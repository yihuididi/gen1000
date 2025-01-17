import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home } from './components/home/home';
import { Login } from './components/login';
import { Register } from './components/register';
import { TaskManagement } from './taskmanagement';
import { auth } from './firebase-config';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }
  
    return user ? children : <Navigate replace to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home user={user?.uid} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<TaskManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
