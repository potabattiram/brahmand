import React, { useState, useEffect } from 'react';
import './SolarSystem.css';

const SolarSystem = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = (event) => {
      if (event.deltaY > 0) {
        // Scrolling down
        setScale((prevScale) => Math.max(prevScale * 0.85, 0.00002)); // Minimum scale 0.2
      } else {
        // Scrolling up
        setScale((prevScale) => Math.min(prevScale * 1.1, 3)); // Maximum scale 3
      }
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <div className="container" style={{ transform: `scale(${scale})` }}>
      <div className="sun"></div>
      <div className="earth">
        <div className="moon"></div>
      </div>
    </div>
  );
};

export default SolarSystem;
