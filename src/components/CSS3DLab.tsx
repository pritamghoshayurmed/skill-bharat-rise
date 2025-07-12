import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CSS3DLabProps {
  labId: string;
  labTitle: string;
  labType: 'chemistry' | 'physics' | 'programming' | 'electronics' | 'biology';
  onProgressUpdate?: (progress: number) => void;
  onExperimentComplete?: (results: any) => void;
}

const CSS3DLab: React.FC<CSS3DLabProps> = ({
  labId,
  labTitle,
  labType,
  onProgressUpdate,
  onExperimentComplete
}) => {
  const [isExperimentRunning, setIsExperimentRunning] = useState(false);
  const [experimentProgress, setExperimentProgress] = useState(0);

  useEffect(() => {
    if (isExperimentRunning) {
      const interval = setInterval(() => {
        setExperimentProgress(prev => {
          const newProgress = Math.min(prev + 10, 100);
          onProgressUpdate?.(newProgress);
          
          if (newProgress >= 100) {
            setIsExperimentRunning(false);
            onExperimentComplete?.({
              success: true,
              labType,
              completionTime: Date.now()
            });
          }
          
          return newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isExperimentRunning, labType, onProgressUpdate, onExperimentComplete]);

  const handleStartExperiment = () => {
    if (isExperimentRunning) {
      setIsExperimentRunning(false);
      setExperimentProgress(0);
    } else {
      setIsExperimentRunning(true);
      setExperimentProgress(0);
    }
  };

  const renderLabEquipment = () => {
    switch (labType) {
      case 'chemistry':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Beakers */}
            <div className="flex gap-8 items-end">
              <div className="relative">
                <div className={`w-16 h-20 bg-gradient-to-b from-transparent to-red-400 rounded-b-full border-2 border-blue-300 ${isExperimentRunning ? 'animate-pulse' : ''}`}>
                  {isExperimentRunning && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-white text-xs text-center mt-2">Solution A</div>
              </div>
              
              <div className="relative">
                <div className={`w-16 h-24 bg-gradient-to-b from-transparent to-blue-400 rounded-b-full border-2 border-blue-300 ${isExperimentRunning ? 'animate-pulse' : ''}`}>
                  {isExperimentRunning && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.3}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-white text-xs text-center mt-2">Solution B</div>
              </div>
              
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-b from-transparent to-green-400 rounded-b-full border-2 border-blue-300 ${isExperimentRunning ? 'animate-pulse' : ''}`}>
                  {isExperimentRunning && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.4}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-white text-xs text-center mt-2">Catalyst</div>
              </div>
            </div>
            
            {/* Bunsen Burner */}
            <div className="absolute bottom-20 right-20">
              <div className="w-8 h-12 bg-gray-400 rounded-t-lg"></div>
              {isExperimentRunning && (
                <div className="w-6 h-8 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full mx-auto animate-pulse"></div>
              )}
            </div>
          </div>
        );
      
      case 'physics':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Pendulum */}
            <div className="relative">
              <div className="w-1 h-32 bg-gray-400 mx-auto"></div>
              <div 
                className={`w-8 h-8 bg-yellow-400 rounded-full mx-auto ${isExperimentRunning ? 'animate-swing' : ''}`}
                style={{
                  transformOrigin: 'center -128px',
                }}
              ></div>
              <div className="text-white text-xs text-center mt-4">Simple Pendulum</div>
            </div>
            
            {/* Inclined Plane */}
            <div className="absolute right-20 bottom-20">
              <div className="w-24 h-2 bg-gray-400 transform rotate-12 origin-left"></div>
              {isExperimentRunning && (
                <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
              )}
              <div className="text-white text-xs text-center mt-2">Inclined Plane</div>
            </div>
          </div>
        );
      
      case 'electronics':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Circuit Board */}
            <div className="w-64 h-40 bg-green-800 rounded-lg p-4 border-2 border-green-600">
              <div className="grid grid-cols-4 gap-4 h-full">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded ${
                      isExperimentRunning 
                        ? 'bg-red-500 animate-pulse' 
                        : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
              
              {/* LEDs */}
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      isExperimentRunning 
                        ? 'bg-green-400 animate-pulse' 
                        : 'bg-gray-400'
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="text-white text-xs text-center mt-4">Circuit Board</div>
          </div>
        );
      
      case 'programming':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Code Blocks */}
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-white text-xs font-mono ${
                    isExperimentRunning 
                      ? 'bg-blue-500 border-blue-300 animate-pulse' 
                      : 'bg-gray-700 border-gray-500'
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {`{${i + 1}}`}
                </div>
              ))}
            </div>
            
            <div className="text-white text-xs text-center mt-4">Code Execution</div>
          </div>
        );
      
      case 'biology':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Cell */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 border-green-400 bg-green-200 bg-opacity-20 ${isExperimentRunning ? 'animate-pulse' : ''}`}>
                {/* Nucleus */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full"></div>
                
                {/* Organelles */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-3 h-3 bg-blue-400 rounded-full ${isExperimentRunning ? 'animate-bounce' : ''}`}
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${20 + i * 20}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  ></div>
                ))}
              </div>
              <div className="text-white text-xs text-center mt-4">Cell Structure</div>
            </div>
            
            {/* Microscope */}
            <div className="absolute right-20 top-20">
              <div className="w-8 h-16 bg-gray-400 rounded-t-lg"></div>
              <div className="w-12 h-4 bg-gray-500 rounded mx-auto"></div>
              <div className="text-white text-xs text-center mt-2">Microscope</div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mx-auto mb-4"></div>
              <p>Virtual Lab Environment</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg overflow-hidden">
      {/* Progress Bar */}
      {isExperimentRunning && (
        <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
          <div className="text-sm mb-2">Experiment Progress</div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
              style={{ width: `${experimentProgress}%` }}
            />
          </div>
          <div className="text-xs mt-1">{experimentProgress}%</div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white max-w-sm">
        <h3 className="text-sm font-bold mb-1">Virtual Lab</h3>
        <p className="text-xs">
          Click the Start button to begin your experiment and observe the animations.
        </p>
      </div>

      {/* Lab Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-32 z-10">
        <h2 className="text-2xl font-bold text-white text-center mb-8">{labTitle}</h2>
      </div>

      {/* Lab Equipment */}
      <div className="absolute inset-0 pt-20 pb-20">
        {renderLabEquipment()}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={handleStartExperiment}
          className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
            isExperimentRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isExperimentRunning ? 'Stop Experiment' : 'Start Experiment'}
        </Button>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(30deg); }
        }
        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CSS3DLab;
