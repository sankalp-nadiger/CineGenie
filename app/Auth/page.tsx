"use client"
// pages/auth.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import dynamic from 'next/dynamic';

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

// Speech Bubble Component
const SpeechBubble: React.FC<{message: string, show: boolean}> = ({ message, show }) => {
  if (!show) return null;
  
  return (
    <motion.div 
      className="absolute left-36 top-10 bg-white p-3 rounded-lg shadow-md max-w-xs z-10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-r-8 border-b-8 border-transparent border-r-white"></div>
      <p className="text-sm">{message}</p>
    </motion.div>
  );
};

// Main Auth component
const Auth: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [stage, setStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [characterState, setCharacterState] = useState('idle');
  const [avatarMessage, setAvatarMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
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
        setAvatarMessage("Now for your password. Keep it secret, keep it safe!");
        break;
      case 3:
        setCharacterState('celebrating');
        setAvatarMessage(isSignIn ? "You're in! Great to have you back." : "Awesome! Your account is ready.");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCharacterState('processing');
    setAvatarMessage("Finalizing your account...");
    setShowMessage(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setCharacterState('celebrating');
      setStage(3);
    }, 2000);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setCharacterState('processing');
    setAvatarMessage("Connecting to Google...");
    setShowMessage(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setCharacterState('celebrating');
      setStage(3);
    }, 2000);
  };

  const resetForm = () => {
    setStage(1);
    setFormData({
      username: '',
      email: '',
      password: '',
    });
    setCharacterState('waving');
    setAvatarMessage("Let's start again!");
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setCharacterState('idle');
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -left-32 -bottom-4 w-32 h-64 cursor-pointer" onClick={interactWithCharacter}>
          <ThreeCharacter state={characterState} />
          <AnimatePresence>
            {showMessage && <SpeechBubble message={avatarMessage} show={showMessage} />}
          </AnimatePresence>
        </div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden ml-32 md:ml-0"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
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
            className="absolute top-4 right-4 text-sm text-blue-500 hover:underline"
          >
            {isSignIn ? 'Create an account' : 'Already have an account?'}
          </button>
          
          <h2 className="text-2xl font-bold mb-1 text-center">
            {isSignIn ? 'Sign in' : 'Signup now'}
          </h2>
          <p className="text-center text-gray-500 mb-6">Moments away from magic!</p>
          
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.div
                key="stage1"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {!isSignIn && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      What's your username? *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        name="username"
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
                        className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Username"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Enter your email address *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      name="email"
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
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                
                <button
                  onClick={goToNextStage}
                  disabled={!formData.email || (!isSignIn && !formData.username)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  Next
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-gray-500 mb-2">Or continue with</p>
                  <button
                    onClick={handleGoogleSignIn}
                    className="inline-flex items-center justify-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full"
                  >
                    <FaGoogle className="mr-2 text-red-500" />
                    Sign {isSignIn ? 'in' : 'up'} with Google
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
              >
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Enter your password *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => {
                        setCharacterState('shielding');
                        setAvatarMessage("Make sure to use a strong password!");
                        setShowMessage(true);
                        setTimeout(() => {
                          setShowMessage(false);
                          setCharacterState('idle');
                        }, 3000);
                      }}
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your password"
                      required
                    />
                  </div>
                  {isSignIn && (
                    <p className="text-right mt-1">
                      <a 
                        href="#" 
                        className="text-sm text-blue-500 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setCharacterState('thinking');
                          setAvatarMessage("I can help you reset your password!");
                          setShowMessage(true);
                          setTimeout(() => {
                            setShowMessage(false);
                            setCharacterState('idle');
                          }, 3000);
                        }}
                      >
                        Forgot password?
                      </a>
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={goToPrevStage}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.password}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    {isSignIn ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              </motion.form>
            )}
            
            {stage === 3 && (
              <motion.div
                key="stage3"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg 
                    className="w-8 h-8 text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {isSignIn ? 'Welcome back!' : 'Account created!'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isSignIn 
                    ? 'You have successfully signed in to your account.' 
                    : 'Your account has been created successfully.'}
                </p>
                <button
                  onClick={resetForm}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                >
                  Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loader w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;