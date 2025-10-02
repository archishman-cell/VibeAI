import MarkdownRenderer from './MarkdownRenderer';
import CopyButton from './CopyButton';

const ResponseSection = ({ 
  content, 
  displayedContent, 
  isTyping, 
  title, 
  icon, 
  variant = "default", // "default" | "suggestion"
  onCopy 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "suggestion":
        return {
          container: "bg-blue-50 border border-blue-200",
          titleColor: "text-blue-800",
          contentColor: "text-blue-700",
          borderColor: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          copyVariant: "blue"
        };
      default:
        return {
          container: "bg-gray-50 border border-gray-100",
          titleColor: "text-gray-800",
          contentColor: "text-gray-800",
          borderColor: "border-gray-200",
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600",
          copyVariant: "default"
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <div className="flex items-start space-x-1">
      {icon && (
        <div className={`w-9 h-9 ${classes.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {typeof icon === 'string' ? (
            <span className="text-lg">{icon}</span>
          ) : (
            <div className={classes.iconColor}>{icon}</div>
          )}
        </div>
      )}
      
      <div className="flex-1">
        <div className={`${classes.container} rounded-lg p-4`}>
          {title && (
            <div className="flex items-center space-x-2 mb-3">
              <h3 className={`text-sm font-semibold ${classes.titleColor}`}>
                {title}
              </h3>
            </div>
          )}
          
          <MarkdownRenderer 
            content={displayedContent}
            className={classes.contentColor}
          />
          
          {isTyping && displayedContent.length < content.length && (
            <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
          )}
          
          {displayedContent.length === content.length && (
            <div className={`mt-4 flex items-center justify-between border-t ${classes.borderColor} pt-3`}>
              <CopyButton 
                text={content}
                label={`Copy ${title || 'Content'}`}
                variant={classes.copyVariant}
              />
              <span className="text-xs text-gray-400">Just now</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseSection;
