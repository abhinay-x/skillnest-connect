import React from 'react';
import Icon from '../../../components/AppIcon';

const SkillsTab = ({ worker }) => {
  const getSkillLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'expert':
        return 'bg-success text-success-foreground';
      case 'advanced':
        return 'bg-primary text-primary-foreground';
      case 'intermediate':
        return 'bg-warning text-warning-foreground';
      case 'beginner':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSkillProgress = (level) => {
    switch (level?.toLowerCase()) {
      case 'expert':
        return 100;
      case 'advanced':
        return 80;
      case 'intermediate':
        return 60;
      case 'beginner':
        return 30;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skills Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Technical Skills */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {worker?.skills?.technical?.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-card-foreground">{skill?.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill?.level)}`}>
                      {skill?.level}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getSkillProgress(skill?.level)}%` }}
                    ></div>
                  </div>
                  {skill?.yearsOfExperience && (
                    <p className="text-xs text-text-secondary">
                      {skill?.yearsOfExperience} years experience
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Equipment */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Tools & Equipment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {worker?.skills?.tools?.map((tool, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Icon name="Wrench" size={20} className="text-primary" />
                  <div>
                    <h4 className="font-medium text-card-foreground">{tool?.name}</h4>
                    <p className="text-xs text-text-secondary">{tool?.proficiency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Soft Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {worker?.skills?.soft?.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-card-foreground">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skill Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Skill Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Expert Level</span>
                <span className="font-semibold text-success">
                  {worker?.skills?.technical?.filter(s => s?.level?.toLowerCase() === 'expert')?.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Advanced Level</span>
                <span className="font-semibold text-primary">
                  {worker?.skills?.technical?.filter(s => s?.level?.toLowerCase() === 'advanced')?.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Total Skills</span>
                <span className="font-semibold text-card-foreground">
                  {worker?.skills?.technical?.length}
                </span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Certifications</h3>
            <div className="space-y-4">
              {worker?.certifications?.map((cert, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name="Award" size={20} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-card-foreground">{cert?.name}</h4>
                      <p className="text-sm text-text-secondary">{cert?.issuer}</p>
                      <p className="text-xs text-text-secondary">
                        Issued: {new Date(cert.issueDate)?.toLocaleDateString()}
                      </p>
                      {cert?.verificationUrl && (
                        <a
                          href={cert?.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Verify Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Programs */}
          {worker?.trainingPrograms && worker?.trainingPrograms?.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Training</h3>
              <div className="space-y-3">
                {worker?.trainingPrograms?.map((training, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon name="BookOpen" size={16} className="text-primary" />
                    <div>
                      <h4 className="text-sm font-medium text-card-foreground">{training?.name}</h4>
                      <p className="text-xs text-text-secondary">
                        {new Date(training.completedDate)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Verification */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="ShieldCheck" size={20} className="text-success" />
              <h3 className="text-lg font-semibold text-success">Skill Verification</h3>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              This professional has completed skill verification tests for:
            </p>
            <div className="space-y-2">
              {worker?.verifiedSkills?.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={14} className="text-success" />
                  <span className="text-sm text-text-secondary">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;