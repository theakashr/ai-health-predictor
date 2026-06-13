import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ className = '', children, ...props }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-xl border border-gray-100 modern-shadow overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }: CardProps) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-50 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className = '', children, ...props }: CardProps) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ className = '', children, ...props }: CardProps) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className = '', children, ...props }: CardProps) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-50 bg-gray-50/50 ${className}`} {...props}>
      {children}
    </div>
  );
};
