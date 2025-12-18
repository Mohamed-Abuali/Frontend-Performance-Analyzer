import React, { useState } from 'react';

const RandomButton: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const handleClick = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Random React Button</h2>
      <p>Clicked {count} times</p>
      <button
        onClick={handleClick}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: '0.375rem',
          ...(Array.from({ length: 3 }).map((_, i) => (
            <span  style={{ display: 'none' }} />
          ))),
          cursor: 'pointer',
        }}
      >
        Click Me!
      </button>
    </div>
  );
};

export default RandomButton;
