import { useState, useEffect } from 'react';
import { auth, sendPasswordResetEmail } from '../firebase/firebase';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { motion } from 'framer-motion';
import Router from 'next/router';

const ResetFormPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To track the loader state
  const [progress, setProgress] = useState(0); // For the progress of the loader

  useEffect(() => {
    let timer;
    if (isLoading) {
      // Update the progress every 50ms
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 2; // Increase progress by 2% every 50ms
        });
      }, 50);
    }

    return () => clearInterval(timer);
  }, [isLoading]);

  const handleResetPasswordRequest = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true); // Start the loader

    try {
      // Fetch the sign-in methods associated with the email

        // Send password reset email
        await sendPasswordResetEmail(auth, email);
        setMessage('A password reset link has been sent to your email!');

        // Timer to route to login after 5 seconds
        setTimeout(() => {
            Router.push("/login");
        }, 5000); // 5000ms = 5 seconds
      
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      setIsLoading(false); // Stop the loader
      console.error('Error sending reset email:', err);
    }
  };

  return (
    <div className="reset-container">
      <motion.div
        className="form-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="title">Reset Password</h1>

        {message && (
          <motion.p
            className="success-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.p>
        )}

        {error && (
          <motion.p
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleResetPasswordRequest} className="reset-form">
          <motion.input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-field"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileFocus={{ scale: 1.05 }}
          />
          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Send Reset Link
          </motion.button>
        </form>

        {/* Slider Loader */}
        {isLoading && (
          <div className="loader-container">
            <motion.div
              className="progress-bar"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetFormPage;
