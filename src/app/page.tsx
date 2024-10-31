'use client' 

import React, { useState } from 'react';
import Scroller from './components/Scroller';


export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here, you could integrate with a backend API or third-party email service
    console.log(`Email submitted: ${email}`);
    setSubmitted(true); // Update state to indicate submission
    setEmail(''); // Clear the form field
  };

  return (
    <>
    <Scroller />
    <div className="min-h-screen bg-gradient-to-tr from-primary-light to-primary-dark lg:flex flex-column p-0">
      
      <div className="lg:flex-col flex w-full">
        <div className="flex-col w-full p-6 text-center justify-center">
          <h1 className="text-[5rem] font-bold text-white leading-none my-12 text-shadow-lg">
            <span className="ps-6 me-52">it&#39;s</span>
            <br/>
            <span className="text-[7rem]">Giving</span>
          </h1>
          <p className="text-white font-medium text-neutral-black dark:text-neutral-gray mb-6 px-10 text-justify">
            Join our community and be the first to know about our launch!Join our community and be the first to know about our launch!Join our community and be the first to know about our launch!Join our community and be the first to know about our launch!Join our community and be the first to know about our launch!Join our community and be the first to know about our launch!Join our community and be the first to know about our launch!Join our community and be the first to know about our launch!Join our community and be the first to know about our launch!
          </p>
        </div>

      </div>


      <div className="lg:flex-col flex w-full justify-center px-10">

        {submitted ? (
          <p className="text-white text-h4 text-center text-shadow-lg font-medium">Thanks for signing up!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 py-24">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-80 p-3 mb-4 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-dark"
            />
            <button
              type="submit"
              className="w-80 bg-primary-light dark:bg-primary-dark text-white text-h4 text-shadow font-bold py-3 px-4 rounded-xl hover-primary hover-soft shadow-soft transition"
            >
              Sign Up for Updates
            </button>
          </form>
        )}
      </div>
    </div>
    </>
  );
}
