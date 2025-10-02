import { useState } from 'react';

const CopyButton = ({ 
  text, 
  label = "Copy", 
  successLabel = "Copied!", 
  className = "",
  variant = "default" // "default" | "blue" | "minimal"
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "blue":
        return copied 
          ? 'text-green-600 font-medium' 
          : 'text-blue-600 hover:text-blue-800';
      case "minimal":
        return copied
          ? 'text-green-500 font-medium'
          : 'text-gray-400 hover:text-gray-600';
      default:
        return copied 
          ? 'text-green-600 font-medium' 
          : 'text-gray-500 hover:text-gray-700';
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`text-sm transition-colors flex items-center space-x-1 ${getVariantClasses()} ${className}`}
      title={copied ? successLabel : label}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successLabel}</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;
