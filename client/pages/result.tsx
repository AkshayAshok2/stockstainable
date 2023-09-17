import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const Result: React.FC = () => {
  const router = useRouter();
  const search = router.query.q;
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const [selectedTab, setSelectedTab] = useState('General'); // Default selected tab

  var companyName;
  var ticker;
  var tickerCopy: string;

  if (search) {
    companyName = search[0];
    ticker = search[1];
    tickerCopy = ticker;
  }

  useEffect(() => {
    // Perform the API call when the component mounts
    if (search) {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/search?q=${tickerCopy}`);
                const data = await response.json();
                console.log(data);
                setApiData(data); // Store the API response in state
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setIsLoading(false);
            }
        };

        fetchData(); // Call the fetchData function
    }
  }, [search]);

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
                        We aim to provide our users with a tool to learn about and monitor the sustainability reputations and practices of S&P 500 companies. 
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
        {isLoading? (
            <div className="flex items-center justify-center h-screen">
                <ClipLoader
                    color="#00BFFF"
                    size={80}
                    loading={isLoading}
                />
            </div>
        ) : (
            <>
                <div className="text-blue-200 absolute top-1/4 left-0 right-0 text-center">
                    <h2 className="text-2xl font-bold">Overall Sustainability Score: {apiData.score}/10</h2>
                </div>

                {/* 2 column format */}
                <div className="absolute top-1/3 flex flex-col items-start justify-center md:flex-row md:space-x-4 w-full">
                    {/* Left column content */}
                    <div className="md:w-1/2 flex flex-col items-center">
                        {/* Tab Selector */}
                        <div className="mb-4 text-white flex space-x-4">
                            <button
                                className={`bg-blue-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded ${selectedTab === 'General' && 'active'}`}
                                onClick={() => setSelectedTab('General')}
                            >
                                General Info
                            </button>
                            <button
                                className={`bg-blue-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded ${selectedTab === 'ESG' && 'active'}`}
                                onClick={() => setSelectedTab('ESG')}
                            >
                                ESG Data
                            </button>
                            <button
                                className={`bg-blue-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded ${selectedTab === 'Sentiment' && 'active'}`}
                                onClick={() => setSelectedTab('Sentiment')}
                            >
                                Sentiment Analysis
                            </button>
                            <button
                                className={`bg-blue-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded ${selectedTab === 'Problems' && 'active'}`}
                                onClick={() => setSelectedTab('Problems')}
                            >
                                Problems
                            </button>
                        </div>

                        {/* Tab Content */}
                        {selectedTab === 'General' && (
                            <div className="text-white mb-4">
                                <b>Industry Category:</b> {apiData.category}<br/>
                                <b>Number of S&P 500 Companies in Category:</b> {apiData.category_size}<br/>
                                <b>Relative Sustainability Performance:</b> {apiData.performance}
                            </div>
                        )}
                        {apiData.has_esg === true && selectedTab === 'ESG' && (
                            <div className="text-white mb-4">
                                <b>Overall ESG Score:</b> {apiData.esg.toFixed(2)}<br/>
                                <b>Environmental Score:</b> {apiData.environment.toFixed(2)}<br/>
                                <b>Social Responsibility Score:</b> {apiData.social.toFixed(2)}<br/>
                                <b>Business Governance Score:</b> {apiData.governance.toFixed(2)}
                            </div>
                        )}
                        {selectedTab === 'Sentiment' && (
                            <div className="text-white mb-4">
                                <b>Public Opinion Sentiment Score:</b> {apiData.sentiment.toFixed(2)} / 1.00<br/>
                                <b>Recent Sustainability Headlines:</b><br/>{apiData.sentimental_headlines}<br/>
                            </div>
                        )}
                        {selectedTab === 'Problems' && (
                            <div className="text-white mb-4">
                                <b>Controversies:</b> {apiData.controversies}<br/>
                                <b>Controversy Score:</b> {apiData.controversy.toFixed(2)} / 5.00<br/>
                                <b>Potentially Unsustainable Practices:</b> {apiData.bad_things}<br/>
                            </div>
                        )}
                        {selectedTab === 'Financial' && (
            
                            <div className="text-white mb-4">
                            {/* Display Financial content */}
                            Financial Data Here
                            </div>
                        )}
                    </div>

                    {/* Right Column content */}
                    <div className="md:w-1/2 flex flex-col items-center">
                        {/* Right column content */}
                        
                            
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default Result;
