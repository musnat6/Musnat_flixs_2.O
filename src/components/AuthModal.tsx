import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { X, Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        setResetMessage('Password reset link sent! Check your email.');
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        onClose();
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication failed';
      if (err.code === 'auth/unauthorized-domain') {
        msg = 'This domain is not authorized in Firebase Console. Please add your domain to Firebase Authentication > Settings > Authorized Domains.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Try signing in instead.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Try again or use "Forgot password?".';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      let msg = err.message || 'Google sign in failed';
      if (err.code === 'auth/unauthorized-domain') {
        msg = 'This domain (e.g., vercel.app) is not authorized in Firebase Console. Add it under Firebase Console > Authentication > Settings > Authorized Domains.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed before completing.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-white/10 w-full max-w-md rounded-xl p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
          {isForgotPassword && (
            <button onClick={() => setIsForgotPassword(false)} className="text-gray-400 hover:text-white transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          {isForgotPassword ? 'Reset Password' : isLogin ? 'Sign In' : 'Sign Up'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded mb-4">
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#333] text-white rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition"
              required
            />
          </div>
          
          {!isForgotPassword && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#333] text-white rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition"
                required
              />
            </div>
          )}

          {!isForgotPassword && isLogin && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => { setIsForgotPassword(true); setError(''); setResetMessage(''); }} 
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] text-white font-bold py-3 rounded mt-2 hover:bg-red-700 transition flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {!isForgotPassword && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded transition flex items-center justify-center gap-3 border border-white/10"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <p className="text-gray-400 text-sm mt-6 text-center">
              {isLogin ? "New to Munsatflixs? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:underline focus:outline-none"
              >
                {isLogin ? 'Sign up now.' : 'Sign in.'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
