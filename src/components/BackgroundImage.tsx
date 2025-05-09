import React from 'react';

const BackgroundImage = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Background Overlay with increased opacity */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm"></div>
      
      {/* Background Image with reduced size */}
      <div className="w-full h-full">
        <img
          src="/lovable-uploads/5105d0d3-77a7-4b00-a04c-402c5d1d67ff.png"
          alt="Background Dam"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
    </div>
  );
};

export default BackgroundImage;