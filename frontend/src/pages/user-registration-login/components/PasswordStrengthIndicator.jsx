import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      number: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    score = Object.values(checks)?.filter(Boolean)?.length;
    
    const strengthLevels = {
      0: { label: '', color: '' },
      1: { label: 'Very Weak', color: 'bg-error' },
      2: { label: 'Weak', color: 'bg-warning' },
      3: { label: 'Fair', color: 'bg-accent' },
      4: { label: 'Good', color: 'bg-secondary' },
      5: { label: 'Strong', color: 'bg-success' }
    };
    
    return { score, ...strengthLevels?.[score], checks };
  };

  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-secondary">Password Strength</span>
        <span className={`text-xs font-medium ${
          strength?.score >= 4 ? 'text-success' : 
          strength?.score >= 3 ? 'text-secondary' : 
          strength?.score >= 2 ? 'text-accent' : 'text-error'
        }`}>
          {strength?.label}
        </span>
      </div>
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5]?.map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full ${
              level <= strength?.score ? strength?.color : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className="text-xs text-text-secondary space-y-1">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className={strength?.checks?.length ? 'text-success' : 'text-text-secondary'}>
            ✓ 8+ characters
          </span>
          <span className={strength?.checks?.uppercase ? 'text-success' : 'text-text-secondary'}>
            ✓ Uppercase
          </span>
          <span className={strength?.checks?.lowercase ? 'text-success' : 'text-text-secondary'}>
            ✓ Lowercase
          </span>
          <span className={strength?.checks?.number ? 'text-success' : 'text-text-secondary'}>
            ✓ Number
          </span>
          <span className={strength?.checks?.special ? 'text-success' : 'text-text-secondary'}>
            ✓ Special char
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;