import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  var stock = "";
  var valid = false;
  var company = "";
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // useEffect(() => {
  //   fetch('http://localhost:8080/api/home')
  //     .then(response => response.json())
  //     .then((data) => { 
  //       setMessage(data.message);
  //       setPeople(data.people);
  //     });
  // }, []);

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

    // if(response.inSP500) {
    //   // Redirect to result.tsx
    //   router.push({
    //     pathname: '/result',
    //     query: { search }
    //   });
    // } else {
    //   alert('Company not found in the S&P 500. Please try another stock.');
    // }
  }

  return (
    <div className='bg-gradient-navy flex flex-col items-center justify-center min-h-screen'>
      <h1
        className={`text-6xl font-extrabold mb-5 ${
          isHovered ? 'animate-title' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          fontFamily: 'Arial, sans-serif', // Set your desired font family
          color: 'white', // Set the text color
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Add a text shadow
        }}
      >
        Stockstainable
      </h1>
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