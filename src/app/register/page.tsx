'use client'

// app/signup/page.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';


const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Make a POST request to your registration API route
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to setup page on successful registration
        const signInResponse = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (signInResponse?.ok) {
          // Redirect to setup page if sign-in succeeds
          router.push(`/dashboard/${data.userId}/setup`);
        } else {
          // Handle sign-in error (optional)
          setError('Sign-in failed after registration. Please try logging in.');
        }
      } else {
        // Handle error if registration fails
        setError(data.message || 'Registration failed, please try again.');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred, please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary-light to-primary-dark relative">

      <div className="flex flex-col lg:flex-row justify-center items-center text-white rounded-lg w-full mx-4 lg:mx-0 ">
        
        
        {/* Left Side Content */}
        <div className="p-8 lg:w-1/2 max-w-xl text-center lg:text-left lg:me-16">
          <h1 className="text-4xl font-bold mb-4">Try It’s Giving free for 30 days</h1>
          <p className="text-lg mb-6">Discover the causes that matter to you. Start making a difference today!</p>
        </div>

        {/* Right Side Form */}
        <div className="bg-white text-gray-900 rounded-lg p-8 lg:w-1/2 max-w-md w-full">
          <h2 className="text-xl font-bold text-center mb-4">Sign Up Today</h2>
          <p className="text-center text-sm text-gray-500 mb-6">No credit card required!</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primaryGreen focus:border-primaryGreen"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primaryGreen focus:border-primaryGreen"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Start Your Free Trial
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4 text-sm">
            By creating an account, you agree to our <a href="#" className="text-primaryGreen underline">Privacy Policy</a> and <a href="#" className="text-primaryGreen underline">Terms of Service</a>.
          </p>

          {/* OR Divider */}
          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Sign-In Option */}
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100">
             Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
