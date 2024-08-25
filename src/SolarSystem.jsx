import React, { useState, useEffect, useRef } from "react";
import "./SolarSystem.css";

const SolarSystem = () => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [positions, setPositions] = useState([]);
  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const previousTranslateX = useRef(0);
  const previousTranslateY = useRef(0);

  useEffect(() => {
    const handleScroll = (event) => {
      if (event.deltaY > 0) {
        // Scrolling down
        setScale((prevScale) => Math.max(prevScale * 0.85, 0.00002)); // Minimum scale 0.00002
      } else {
        // Scrolling up
        setScale((prevScale) => Math.min(prevScale * 1.1, 3)); // Maximum scale 3
      }
    };
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scale < 0.2 && positions.length === 0) {
      // Show duplicates when scale is less than 0.2
      setPositions([
        { top: "10%", left: "20%" },
        { top: "40%", left: "70%" },
        { top: "60%", left: "30%" },
        { top: "80%", left: "50%" },
        { top: "50%", left: "10%" },
        { top: "20%", left: "80%" },
      ]);
    } else if (scale >= 0.2 && positions.length > 0) {
      // Hide duplicates when scale is 0.2 or greater
      setPositions([]);
    }
  }, [scale, positions.length]);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      requestRef.current = requestAnimationFrame(() => {
        setTranslateX((prevX) => prevX + dx);
        setTranslateY((prevY) => prevY + dy);
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    cancelAnimationFrame(requestRef.current);
    previousTranslateX.current = translateX;
    previousTranslateY.current = translateY;
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        container.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, translateX, translateY]);

  const renderSolarSystem = (additionalStyle = {}) => (
    <div
      className="container"
      style={{
        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
        ...additionalStyle,
      }}
    >
      <div className="sun" title="Sun"></div>
      <div className="mercury" title="Mercury"></div>
      <div className="venus" title="Venus"></div>
      <div className="earth" title="Earth">
        <div className="moon" title="Moon"></div>
      </div>
      <div className="mars" title="Mars"></div>
      <div className="jupiter" title="Jupiter"></div>
      <div className="saturn" title="Saturn"></div>
      <div className="uranus" title="Uranus"></div>
      <div className="neptune" title="Neptune"></div>
    </div>
  );

  return (
    <div>
      {renderSolarSystem()} {/* Original Solar System */}
      {positions.map((position, index) =>
        renderSolarSystem({
          position: "absolute",
          top: position.top,
          left: position.left,
          transform: `scale(${scale})`, // Ensure the scale is applied to each instance
        })
      )}
    </div>
  );
};

export default SolarSystem;
