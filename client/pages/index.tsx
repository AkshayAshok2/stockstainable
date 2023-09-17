import React, { useEffect, useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  var stock = "";
  var valid = false;
  var company = "";
  const router = useRouter();

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);

  // const aboutDropdownRef = useRef<HTMLDivElement>(null);
  // const authorsDropdownRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       aboutDropdownRef.current &&
  //       !aboutDropdownRef.current.contains(event.target as Node) &&
  //       isAboutDropdownOpen
  //     ) {
  //       setIsAboutDropdownOpen(false);
  //     }

  //     if (
  //       authorsDropdownRef.current &&
  //       !authorsDropdownRef.current.contains(event.target as Node) &&
  //       isAuthorsDropdownOpen
  //     ) {
  //       setIsAuthorsDropdownOpen(false);
  //     }
  //   };
  // });

  const handleSearch = async (e: FormEvent)=> {
    console.log('handleSearch called')
    e.preventDefault();

    if (!search.trim()) {
      // Optionally, you can provide user feedback for an empty search
      alert('Search input is empty. Please enter a valid stock symbol.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/check?q=${search}`);
      const data = await response.json();
      if (data.inSP500) {
        valid = true;
        stock = data.stock;
        company = data.companyName;
      }
    } catch (error) {
      console.error('Error checking stock: ', error);
    }

    if (valid) {
      router.push({
        pathname: '/result',
        query: { q: [company, stock]}
      })
    }
    else {
      alert('Company not found in the S&P 500. Please try another stock.')
    }
  }

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
    <div className='bg-gradient-navy flex flex-col items-center justify-center min-h-screen'>
      <div className="navbar w-full bg-gray-900 text-white p-4 fixed top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="dropdown-buttons space-x-4">
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
      <img src='/stockstainable.png' className='mb-4' />
      <form onSubmit={handleSearch} className='flex items-center'>
        <input 
          type="text"
          placeholder="Search by stock symbol (e.g. MSFT)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-l px-4 py-2 w-72 focus:outline-none"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white rounded-r px-4 py-2 hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Home;
