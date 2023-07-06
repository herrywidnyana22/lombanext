import clsx from 'clsx';
import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  className?: string
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ text, className, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative">
      <div
        className={clsx(
            `absolute 
            flex items-center justify-center
            text-center
            w-[120px]
            bg-gray-900 
            text-white
            -top-[15px]
            left-1/2 
            transform 
            -translate-x-1/2 
            -translate-y-1/2
            px-2 
            py-1
            text-sm
            rounded 
            transition-opacity 
            duration-200`,
            className,
            isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        {text}
      </div>
      <div
        className='mt-2'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

export default Tooltip;


