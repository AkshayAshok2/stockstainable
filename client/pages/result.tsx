import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Result: React.FC = () => {
  const router = useRouter();
  const search = router.query.q;
  var companyName;
  var ticker;

  if (search) {
    companyName = search[0];
    ticker = search[1];
  }

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);

  const toggleAbout = () => {
    setIsAboutOpen(!isAboutOpen);
    setIsAuthorsOpen(false); // Close the Authors section when opening About
  }

  const toggleAuthors = () => {
    setIsAuthorsOpen(!isAuthorsOpen);
    setIsAboutOpen(false); // Close the About section when opening Authors
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        (isAboutOpen || isAuthorsOpen) &&
        target.closest('.navbar') === null &&
        target.closest('.dropdown-buttons') === null
      ) {
        setIsAboutOpen(false);
        setIsAuthorsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isAboutOpen, isAuthorsOpen]);

  return (
    <div className="bg-gradient-navy flex flex-col items-center justify-center min-h-screen relative">
        <div className="navbar w-full bg-gray-900 text-white p-4 fixed top-0 z-10">
            <div className="flex justify-between items-center">
                <div className="dropdown-buttons space-x-4">
                    <button className="text-blue-300 hover:underline cursor-pointer">
                        <Link href="/">
                            <span>Home</span>
                        </Link>
                    </button>
                    <button
                        onClick={toggleAbout}
                        className="text-orange-300 hover:underline cursor-pointer"
                        >
                        About
                    </button>
                    {isAboutOpen && (
                    <div className="absolute mt-2 p-2 bg-white text-gray-900 rounded-lg shadow-md w-96">
                        Welcome to <b>StockStainable</b>!<br/>
                        We are a sustainability-observing tool for S&P 500 companies. 
                        This tool computes a sustainability score for all aforementioned companies, 
                        derived from ESG &#40;Environmental, Social, and Business Governance&#41; scores,
                        sustainability news sentiment analysis using NLP, and other data
                        &#40;lawsuits, controversies, etc.&#41;.
                    </div>
                    )}
                    <button
                    onClick={toggleAuthors}
                    className="text-green-300 hover:underline cursor-pointer"
                    >
                    Authors
                    </button>
                    {isAuthorsOpen && (
                    <div className="absolute mt-2 p-2 bg-white text-gray-900 rounded-lg shadow-md">
                        <p>
                        <a href="https://www.linkedin.com/in/nbutakow/" target="_blank" className='text-blue-500 underline'>
                            Nic Butakow
                        </a>
                        <br />
                        <a href="https://www.linkedin.com/in/alex-huang-954x/" target="_blank" className='text-blue-500 underline'>
                            Alex Huang
                        </a>
                        <br />
                        <a href="https://www.linkedin.com/in/akshayashok1/" target="_blank" className='text-blue-500 underline'>
                            Akshay Ashok
                        </a>
                        <br />
                        <a href="https://www.linkedin.com/in/dylan-mcgarry/" target="_blank" className='text-blue-500 underline'>
                            Dylan McGarry
                        </a>
                        </p>
                    </div>
                    )}
                </div>
            </div>
        </div>
        <div className="text-white absolute top-20 left-0 right-0 text-center">
            <h1 className="text-3xl font-bold">{companyName} ({ticker})</h1>
        </div>
        <p className="text-white mb-4">*information*</p>
    </div>
  );
};

export default Result;
