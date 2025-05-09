import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [accessCount, setAccessCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Simulating access count (in a real scenario, this would be fetched from the server)
    const fetchAccessCount = async () => {
      // Replace this with an actual API call in production
      setAccessCount(prev => prev + 1);
    };
    fetchAccessCount();

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-blue-900 text-white p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          {currentTime.toLocaleString()}
        </div>
        <div>
          Acessos: {accessCount}
        </div>
      </div>
    </footer>
  );
};

export default Footer;