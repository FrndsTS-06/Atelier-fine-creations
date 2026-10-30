import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', style }) => {
  return (
    <div className={`container ${className}`} style={style}>
      {children}
    </div>
  );
};
