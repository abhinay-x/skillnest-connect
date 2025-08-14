import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingProgressIndicator = ({ currentStep = 1, totalSteps = 5 }) => {
  const steps = [
    { id: 1, label: 'Service', icon: 'Wrench' },
    { id: 2, label: 'Schedule', icon: 'Calendar' },
    { id: 3, label: 'Details', icon: 'FileText' },
    { id: 4, label: 'Payment', icon: 'CreditCard' },
    { id: 5, label: 'Confirm', icon: 'CheckCircle' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary';
      case 'upcoming':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorClasses = (stepId) => {
    return stepId < currentStep ? 'bg-success' : 'bg-border';
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {steps?.map((step, index) => {
          const status = getStepStatus(step?.id);
          const isLast = index === steps?.length - 1;

          return (
            <div key={step?.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center transition-smooth
                  ${getStepClasses(status)}
                `}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                <span className={`
                  text-xs font-medium mt-2 text-center
                  ${status === 'current' ? 'text-primary' : 
                    status === 'completed' ? 'text-success' : 'text-muted-foreground'}
                `}>
                  {step?.label}
                </span>
              </div>
              {!isLast && (
                <div className={`
                  flex-1 h-0.5 mx-4 transition-smooth
                  ${getConnectorClasses(step?.id)}
                `} />
              )}
            </div>
          );
        })}
      </div>
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingProgressIndicator;