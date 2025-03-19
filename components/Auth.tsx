"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

// Import Three.js components with dynamic import (no SSR)
const ThreeCharacter = dynamic(() => import('@/components/ThreeCharacter'), {
  ssr: false,
  loading: () => <div className="w-32 h-64 bg-gray-200 rounded animate-pulse"></div>
});

// Form stages animations
const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

const StyledWrapper = styled.div`
  // Dark theme colors
  background-color: #111827;
  
  .form-container {
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
  }

  .input-group input, .input-group textarea {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: rgba(17, 24, 39, 1);
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
  }

  .input-group input:focus, .input-group textarea:focus {
    border-color: rgba(167, 139, 250);
  }

  .sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    margin-top: 1rem;
    cursor: pointer;
  }

  .sign:disabled {
    background-color: rgba(107, 114, 128, 0.5);
    cursor: not-allowed;
  }

  .social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
  }

  .line {
    height: 1px;
    flex: 1 1 0%;
    background-color: rgba(55, 65, 81, 1);
  }

  .social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(156, 163, 175, 1);
  }

  .social-icons {
    display: flex;
    justify-content: center;
  }

  .social-icons .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    background-color: transparent;
    margin-left: 8px;
    cursor: pointer;
  }

  .social-icons .icon svg {
    height: 1.25rem;
    width: 1.25rem;
    fill: #fff;
  }
  
  // Add additional styles for the animation and other elements
  .ml-32 {
    margin-left: 8rem;
  }
  
  .md\\:ml-0 {
    @media (min-width: 768px) {
      margin-left: 0;
    }
  }
  
  // Dark theme specific styles
  .bg-dark {
    background-color: #111827;
    min-height: 100vh;
  }

  .char-count {
    font-size: 0.75rem;
    color: rgba(156, 163, 175, 1);
    text-align: right;
    margin-top: 0.25rem;
  }

  // Password field styles
  .password-field {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(156, 163, 175, 1);
    cursor: pointer;
  }

  // Forgot password styles
  .forgot {
    margin-top: 8px;
    text-align: right;
  }

  .forgot a {
    color: rgba(167, 139, 250, 1);
    font-size: 0.75rem;
    text-decoration: none;
  }

  .forgot a:hover {
    text-decoration: underline;
  }

  // Modal styles
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    border-radius: 0.75rem;
    max-width: 24rem;
    width: 100%;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .modal-close {
    background: none;
    border: none;
    color: rgba(156, 163, 175, 1);
    cursor: pointer;
    font-size: 1.5rem;
  }
`;

// Speech Bubble Component - Now positions on the right side of the character
const SpeechBubble: React.FC<{message: string, show: boolean}> = ({ message, show }) => {
    if (!show) return null;
    
    return (
      <motion.div 
        className="absolute right-32 top-10 bg-white p-3 rounded-lg shadow-md max-w-xs z-10 text-black" 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute -right-2 top-4 w-0 h-0 border-t-8 border-l-8 border-b-8 border-transparent border-l-white"></div>
        <p className="text-sm">{message}</p>
      </motion.div>
    );
  };

// Forgot Password Modal
const ForgotPasswordModal: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (email: string) => void
}> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      onSubmit(email);
    }, 1500);
  };
  
  return (
    <div className="modal-overlay">
      <motion.div 
        className="modal-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="modal-header">
          <h3 className="text-lg font-bold">Reset Password</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        {!isSent ? (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-400 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="input-group">
              <label htmlFor="reset-email">Email Address</label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button 
              type="submit" 
              className="sign mt-4"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h4 className="text-lg font-medium mb-2">Check your inbox</h4>
            <p className="text-sm text-gray-400 mb-4">
              We've sent a password reset link to {email}
            </p>
            <button className="sign" onClick={onClose}>Close</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Main Auth component
const Auth: React.FC = () => {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [stage, setStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [characterState, setCharacterState] = useState('idle');
  const [avatarMessage, setAvatarMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: ''
  });

  // Character interaction messages based on form state
  useEffect(() => {
    if (isLoading) {
      setCharacterState('thinking');
      setAvatarMessage("Processing your request...");
      setShowMessage(true);
      return;
    }
    
    switch(stage) {
      case 1:
        setCharacterState('waving');
        setAvatarMessage(isSignIn ? "Welcome back! Let's sign in." : "Hello! Ready to sign up?");
        break;
      case 2:
        setCharacterState('waiting');
        setAvatarMessage(isSignIn ? "I promise I'm not peeking at your password!" : "Choose a strong password to protect your account!");
        break;
      case 3:
        if (isSignIn) {
          setCharacterState('celebrating');
          setAvatarMessage("You're in! Great to have you back.");
        } else {
          setCharacterState('celebrating');
          setAvatarMessage("Awesome! Your account is ready. Tell us about yourself!");
        }
        break;
      case 4:
        setCharacterState('celebrating');
        setAvatarMessage("Perfect! Your profile is all set up.");
        break;
      default:
        setCharacterState('idle');
    }
    
    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
      setCharacterState('idle');
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [stage, isLoading, isSignIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Character reacts to user input
    if (value.length > 0 && !showMessage) {
      setCharacterState('typing');
      setAvatarMessage("Looking good! Keep going!");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setCharacterState('idle');
      }, 2000);
    }
  };

  const interactWithCharacter = () => {
    setCharacterState('surprised');
    setAvatarMessage("Hey there! I'm here to help you sign up.");
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setCharacterState('idle');
    }, 3000);
  };

  const goToNextStage = () => {
    setIsLoading(true);
    setCharacterState('thinking');
    setAvatarMessage("Let me process that for you...");
    setShowMessage(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStage(prev => prev + 1);
    }, 1500);
  };

  const goToPrevStage = () => {
    setCharacterState('pointing');
    setAvatarMessage("Let's go back and fix that.");
    setShowMessage(true);
    setStage(prev => prev - 1);
    setTimeout(() => {
      setShowMessage(false);
      setCharacterState('idle');
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCharacterState('processing');
    setAvatarMessage(isSignIn ? "Signing you in..." : "Finalizing your account...");
    setShowMessage(true);
  
    if (isSignIn) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setCharacterState('celebrating');
          setAvatarMessage("Login successful! Taking you to your dashboard!");
          setShowMessage(true);
          
          setTimeout(() => {
            router.push('/MainPage'); 
          }, 2000); 
        } else {
          throw new Error(data.message || 'Something went wrong');
        }
      } catch (error) {
        setIsLoading(false);
        setCharacterState('error');
        setAvatarMessage((error as Error).message);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          setCharacterState('idle');
        }, 3000);
      }
    } else {
      // Navigate to bio form (stage 3) if signing up
      setTimeout(() => {
        setIsLoading(false);
        setStage(3);
      }, 1000);
    }
  };
  
  const handleBioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCharacterState('processing');
    setAvatarMessage("Saving your profile...");
    setShowMessage(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          bio: formData.bio,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setIsLoading(false);
        setCharacterState('celebrating');
        setStage(4); // Move to the next stage
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setIsLoading(false);
      setCharacterState('error');
      setAvatarMessage((error as Error).message);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setCharacterState('idle');
      }, 3000);
    }
  };
  
 
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setCharacterState('processing');
    setAvatarMessage("Connecting to Google...");
    setShowMessage(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (isSignIn) {
        router.push('/MainPage');
      } else {
        setCharacterState('celebrating');
        setStage(3);
      }
    }, 2000);
  };

  const goToDashboard = () => {
    setIsLoading(true);
    setCharacterState('waving');
    setAvatarMessage("Taking you to your dashboard!");
    setShowMessage(true);
    
    setTimeout(() => {
      router.push('/MainPage');
    }, 1500);
  };

  const resetForm = () => {
    setStage(1);
    setFormData({
      username: '',
      email: '',
      password: '',
      bio: ''
    });
    setCharacterState('waving');
    setAvatarMessage("Let's start again!");
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setCharacterState('idle');
    }, 3000);
  };

  const handleForgotPassword = (email: string) => {
    console.log(`Password reset email sent to: ${email}`);
    // In a real app, this would call your API endpoint to send reset email
    setCharacterState('processing');
    setAvatarMessage("I've sent you a password reset email!");
    setShowMessage(true);
    
    setTimeout(() => {
      setShowMessage(false);
      setCharacterState('idle');
      setForgotPasswordModalOpen(false);
    }, 3000);
  };
  return (
    <StyledWrapper>
      <div className="flex items-center justify-center min-h-screen bg-dark p-4">
        <div className="relative w-full max-w-md">
        <div className="absolute -left-32 -bottom-4 w-32 h-64 cursor-pointer z-20" onClick={interactWithCharacter}>
  <ThreeCharacter state={characterState} />
  <AnimatePresence>
    {showMessage && <SpeechBubble message={avatarMessage} show={showMessage} />}
  </AnimatePresence>
</div>
          
          <motion.div 
            className="form-container ml-32 md:ml-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
          
            <p className="title">
              {isSignIn ? 'Login' : 'Signup now'}
            </p>
            
            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.div
                  key="stage1"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="form"
                >
                  {!isSignIn && (
                    <div className="input-group">
                      <label htmlFor="username">
                        What's your username? *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          onFocus={() => {
                            setCharacterState('pointing');
                            setAvatarMessage("Choose a username you'll remember!");
                            setShowMessage(true);
                            setTimeout(() => {
                              setShowMessage(false);
                              setCharacterState('idle');
                            }, 3000);
                          }}
                          placeholder="Username"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="input-group">
                    <label htmlFor="email">
                      Enter your email address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => {
                          setCharacterState('pointing');
                          setAvatarMessage("Make sure to use a valid email!");
                          setShowMessage(true);
                          setTimeout(() => {
                            setShowMessage(false);
                            setCharacterState('idle');
                          }, 3000);
                        }}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={goToNextStage}
                    disabled={!formData.email || (!isSignIn && !formData.username)}
                    className="sign"
                  >
                    Next
                  </button>
                  
                  <div className="social-message">
                    <div className="line"></div>
                    <p className="message">Or continue with</p>
                    <div className="line"></div>
                  </div>
                  
                  <div className="social-icons">
                    <button
                      onClick={handleGoogleSignIn}
                      aria-label="Log in with Google"
                      className="icon"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                        <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
                      </svg>
                    </button>
                    <button
                      aria-label="Log in with Twitter"
                      className="icon"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                        <path d="M31.937 6.093c-1.177 0.516-2.437 0.871-3.765 1.032 1.355-0.813 2.391-2.099 2.885-3.631-1.271 0.74-2.677 1.276-4.172 1.579-1.192-1.276-2.896-2.079-4.787-2.079-3.625 0-6.563 2.937-6.563 6.557 0 0.521 0.063 1.021 0.172 1.495-5.453-0.255-10.287-2.875-13.52-6.833-0.568 0.964-0.891 2.084-0.891 3.303 0 2.281 1.161 4.281 2.916 5.457-1.073-0.031-2.083-0.328-2.968-0.817v0.079c0 3.181 2.26 5.833 5.26 6.437-0.547 0.145-1.131 0.229-1.724 0.229-0.421 0-0.823-0.041-1.224-0.115 0.844 2.604 3.26 4.5 6.14 4.557-2.239 1.755-5.077 2.801-8.135 2.801-0.521 0-1.041-0.025-1.563-0.088 2.917 1.86 6.36 2.948 10.079 2.948 12.067 0 18.661-9.995 18.661-18.651 0-0.276 0-0.557-0.021-0.839 1.287-0.917 2.401-2.079 3.281-3.396z" />
                      </svg>
                    </button>
                    <button
                      aria-label="Log in with GitHub"
                      className="icon"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                        <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-center mt-4">
                    <button 
                      onClick={() => {
                        setIsSignIn(!isSignIn);
                        setCharacterState('waving');
                        setAvatarMessage(isSignIn ? "Let's create a new account!" : "Welcome back!");
                        setShowMessage(true);
                        setTimeout(() => {
                          setShowMessage(false);
                          setCharacterState('idle');
                        }, 3000);
                      }} 
                      className="text-sm hover:underline"
                      style={{ color: "rgba(167, 139, 250, 1)" }}
                    >
                      {isSignIn ? 'Create an account' : 'Already have an account?'}
                    </button>
                  </div>
                </motion.div>
              )}
              
              {stage === 2 && (
                <motion.form
                  key="stage2"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="form"
                >
                  <div className="input-group">
                    <label htmlFor="password">
                      {isSignIn ? 'Enter your password *' : 'Create a password *'}
                    </label>
                    <div className="password-field">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => {
                          setCharacterState(isSignIn ? 'waiting' : 'shielding');
                          setAvatarMessage(isSignIn 
                            ? "Don't worry, I won't peek at your password!" 
                            : "Make sure to use a strong password!");
                          setShowMessage(true);
                          setTimeout(() => {
                            setShowMessage(false);
                            setCharacterState('idle');
                          }, 3000);
                        }}
                        placeholder={isSignIn ? "Your password" : "Create a strong password"}
                        required
                      />
                      <button 
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {isSignIn && (
                      <div className="forgot">
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setForgotPasswordModalOpen(true);
                            setCharacterState('thinking');
                            setAvatarMessage("I can help you reset your password!");
                            setShowMessage(true);
                            setTimeout(() => {
                              setShowMessage(false);
                              setCharacterState('idle');
                            }, 3000);
                          }}
                        >
                          Forgot Password?
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', padding: '5px'}}>
                    <button
                      type="button"
                      onClick={goToPrevStage}
                      style={{ 
                        flex: '1', 
                        backgroundColor: 'rgba(55, 65, 81, 1)', 
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.password}
                      style={{ 
                        flex: '1', 
                        backgroundColor: formData.password ? 'rgba(167, 139, 250, 1)' : 'rgba(107, 114, 128, 0.5)', 
                        color: formData.password ? 'rgba(17, 24, 39, 1)' : 'white',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        fontWeight: '600',
                        cursor: formData.password ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {isSignIn ? 'Sign In' : 'Sign Up'}
                    </button>
                  </div>
                </motion.form>
              )}
              {stage === 3 && !isSignIn && (
  <motion.form
    key="stage3"
    variants={formVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ duration: 0.3 }}
    onSubmit={handleBioSubmit}
    className="form"
  >
    <div className="input-group">
      <label htmlFor="bio">
        Tell us about yourself (optional)
      </label>
      <textarea
        name="bio"
        id="bio"
        value={formData.bio}
        onChange={handleInputChange}
        onFocus={() => {
          setCharacterState('excited');
          setAvatarMessage("Tell us about yourself. We'd love to know you better!");
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
            setCharacterState('idle');
          }, 3000);
        }}
        placeholder="Share a bit about yourself..."
        rows={4}
      />
      <div className="char-count">
        {formData.bio.length}/500 characters
      </div>
    </div>
    
    <div style={{ display: 'flex', gap: '8px', padding: '5px' }}>
      <button
        type="button"
        onClick={goToPrevStage}
        style={{ 
          flex: '1', 
          backgroundColor: 'rgba(55, 65, 81, 1)', 
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Back
      </button>
      <button
        type="submit"
        style={{ 
          flex: '1', 
          backgroundColor: 'rgba(167, 139, 250, 1)', 
          color: 'rgba(17, 24, 39, 1)',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Complete Profile
      </button>
    </div>
  </motion.form>
)}

{stage === 4 && !isSignIn && (
  <motion.div
    key="stage4"
    variants={formVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ duration: 0.3 }}
    className="form"
  >
    <div className="text-center">
      <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2">Account Created!</h3>
      <p className="text-gray-400 mb-6">
        Your account has been successfully created. You're ready to go!
      </p>
      <button
        onClick={goToDashboard}
        className="sign"
      >
        Go to Dashboard
      </button>
      <button
        onClick={resetForm}
        className="mt-4 text-sm hover:underline"
        style={{ color: "rgba(167, 139, 250, 1)" }}
      >
        Create Another Account
      </button>
    </div>
  </motion.div>
)}
</AnimatePresence>
{isLoading && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
  >
    <Loader />
  </motion.div>
)}

{/* Forgot Password Modal */}
<AnimatePresence>
  {forgotPasswordModalOpen && (
    <ForgotPasswordModal
      isOpen={forgotPasswordModalOpen}
      onClose={() => setForgotPasswordModalOpen(false)}
      onSubmit={handleForgotPassword}
    />
  )}
</AnimatePresence>

</motion.div>

</div>
</div>
</StyledWrapper>
)
};



export default Auth;