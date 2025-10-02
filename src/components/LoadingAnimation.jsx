const LoadingAnimation = () => {
  return (
    <div className="max-w-3xl w-full">
      <div className="flex items-start space-x-4 p-6">
        <img 
          src="./assets/logo.png" 
          alt="Logo" 
          className="w-9 h-9 bg-transparent rounded-lg flex items-center justify-center flex-shrink-0 p-1" 
        />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
            </div>
            
            {/* Simulated content loading */}
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded-full animate-pulse w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded-full animate-pulse w-3/5"></div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
