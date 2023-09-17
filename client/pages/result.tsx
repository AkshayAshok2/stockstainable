import React, { useState } from 'react';
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

  

  return (
    <div className="bg-gradient-navy flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-4 font-bold text-white">Search Result</h1>
      <p className="text-white mb-4">You searched for: {companyName} &#40;{ticker}&#41;</p>
      <Link href="/">
        <span className="text-blue-500 hover:underline cursor-pointer">Go back to search</span>
      </Link>
    </div>
  );
};

export default Result;
