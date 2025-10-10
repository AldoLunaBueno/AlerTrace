import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../public/Smart Robotic Production.json';

interface LottieAnimationProps {
  className?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ 
  className = ''
}) => {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <Lottie
        animationData={animationData}
        style={{ 
          width: '100%', 
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default LottieAnimation;
