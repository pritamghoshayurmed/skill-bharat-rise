import React from 'react';

interface CSS3DPreviewProps {
  labType: string;
  className?: string;
}

const CSS3DPreview: React.FC<CSS3DPreviewProps> = ({ labType, className = "" }) => {
  const renderPreview = () => {
    switch (labType.toLowerCase()) {
      case 'chemistry':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="flex gap-2 items-end">
              <div className="w-4 h-6 bg-gradient-to-b from-transparent to-red-400 rounded-b-full border border-blue-300 animate-pulse"></div>
              <div className="w-4 h-8 bg-gradient-to-b from-transparent to-blue-400 rounded-b-full border border-blue-300 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-5 bg-gradient-to-b from-transparent to-green-400 rounded-b-full border border-blue-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        );
      
      case 'physics':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative">
              <div className="w-0.5 h-8 bg-gray-400 mx-auto"></div>
              <div 
                className="w-3 h-3 bg-yellow-400 rounded-full mx-auto animate-swing"
                style={{ transformOrigin: 'center -32px' }}
              ></div>
            </div>
            <style jsx>{`
              @keyframes swing {
                0%, 100% { transform: rotate(-20deg); }
                50% { transform: rotate(20deg); }
              }
              .animate-swing {
                animation: swing 2s ease-in-out infinite;
              }
            `}</style>
          </div>
        );
      
      case 'programming':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-blue-500 rounded animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        );
      
      case 'electronics':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-12 h-8 bg-green-800 rounded p-1">
              <div className="grid grid-cols-3 gap-1 h-full">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-red-500 rounded animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'biology':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative">
              <div className="w-8 h-8 rounded-full border-2 border-green-400 bg-green-200 bg-opacity-20 animate-pulse">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute top-1 left-1 w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded animate-pulse"></div>
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-32 ${className}`}>
      {renderPreview()}
    </div>
  );
};

export default CSS3DPreview;
