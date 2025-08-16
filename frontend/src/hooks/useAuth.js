import { useAuth as useAuthContext } from '../context/AuthContext.jsx';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Re-export the useAuth hook from context for convenience
export const useAuth = () => {
  const auth = useAuthContext();

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      
      // Specific error handling
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  };

  return { ...auth, handleLogin };
};
