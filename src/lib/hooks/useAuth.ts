import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserProfile, 
  isAuthenticated, 
  getUserRole, 
  isAdmin, 
  logout as authLogout,
  fetchUserProfile
} from '../services/authService';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const logout = () => {
    authLogout();
    setUser(null);
    router.push('/login');
  };
  
  const requireAuth = (callback?: () => void) => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    
    if (callback) callback();
    return true;
  };
  
  const requireAdmin = (callback?: () => void) => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/login');
      return false;
    }
    
    if (callback) callback();
    return true;
  };
  
  return {
    user,
    loading,
    error,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    role: getUserRole(),
    logout,
    requireAuth,
    requireAdmin
  };
}
