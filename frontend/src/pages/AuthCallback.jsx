import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { axiosInstance } from '../App';

const AuthCallback = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in React StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL fragment
        const fragment = location.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          toast.error('Invalid session');
          navigate('/auth');
          return;
        }

        // Exchange session_id for user data and session_token
        const response = await axiosInstance.post('/auth/google/callback', {
          session_id: sessionId
        });

        const { user, session_token } = response.data;

        // Store token and user data
        localStorage.setItem('token', session_token);
        onLogin(user, session_token);

        toast.success(`Welcome back, ${user.name}! 🎉`);

        // Navigate to dashboard with user data
        navigate('/dashboard', { state: { user }, replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/auth');
      }
    };

    processSession();
  }, [location, navigate, onLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-muted-foreground">Completing sign in... 🙏</p>
      </div>
    </div>
  );
};

export default AuthCallback;
