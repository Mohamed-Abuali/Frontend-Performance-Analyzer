import React, { useState, useEffect } from 'react';

const RandomReactComponent: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [color, setColor] = useState<string>('#000000');

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
      setColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Inline arrow functions trigger re-creation on every render
  const handleReset = () => setCount(0);
  const handleIncrement = () => setCount(prev => prev + 1);
  const handleDecrement = () => setCount(prev => prev - 1);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ color }}>Random React Component</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
    </div>
  );
};

export default RandomReactComponent;
