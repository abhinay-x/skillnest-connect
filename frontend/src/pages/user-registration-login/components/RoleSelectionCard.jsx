import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelectionCard = ({ 
  role, 
  title, 
  description, 
  icon, 
  isSelected, 
  onSelect 
}) => {
  return (
    <button
      onClick={() => onSelect(role)}
      className={`w-full p-6 rounded-lg border-2 transition-all duration-200 text-left ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-elevation-2'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${
          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-secondary'
        }`}>
          <Icon name={icon} size={24} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-2 ${
            isSelected ? 'text-primary' : 'text-text-primary'
          }`}>
            {title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected 
            ? 'border-primary bg-primary' :'border-border'
        }`}>
          {isSelected && (
            <Icon name="Check" size={12} color="white" />
          )}
        </div>
      </div>
    </button>
  );
};

export default RoleSelectionCard;