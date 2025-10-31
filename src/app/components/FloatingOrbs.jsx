// ===== components/FloatingOrbs.jsx =====
import React from 'react';

export const FloatingOrbs = ({ mousePosition }) => {
  return (
    <>
      <div 
        className="fixed w-96 h-96 bg-gradient-to-br from-amber-300/20 to-orange-400/20 rounded-full blur-3xl pointer-events-none"
        style={{
          top: mousePosition.y - 200,
          left: mousePosition.x - 200,
          transition: 'all 0.3s ease-out'
        }}
      />
      <div 
        className="fixed w-96 h-96 bg-gradient-to-br from-blue-300/15 to-indigo-400/15 rounded-full blur-3xl pointer-events-none"
        style={{
          top: mousePosition.y - 100,
          left: mousePosition.x + 100,
          transition: 'all 0.5s ease-out'
        }}
      />
    </>
  );
};