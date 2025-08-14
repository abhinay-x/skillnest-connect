import React from 'react';
import Icon from '../../../components/AppIcon';

const ExperienceTab = ({ worker }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const months = diffMonths % 12;
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Experience Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Work Experience</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-8">
                {worker?.experience_timeline?.map((exp, index) => (
                  <div key={index} className="relative flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-2 border-surface">
                      <Icon name="Briefcase" size={16} color="white" />
                    </div>
                    
                    {/* Experience Content */}
                    <div className="flex-1 min-w-0 pb-8">
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {exp?.position}
                          </h3>
                          <span className="text-sm text-text-secondary">
                            {formatDate(exp?.startDate)} - {exp?.endDate ? formatDate(exp?.endDate) : 'Present'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <Icon name="Building" size={16} className="text-text-secondary" />
                          <span className="text-text-secondary">{exp?.company}</span>
                          <span className="text-text-secondary">•</span>
                          <span className="text-text-secondary">
                            {calculateDuration(exp?.startDate, exp?.endDate)}
                          </span>
                        </div>
                        
                        <p className="text-text-secondary mb-3">{exp?.description}</p>
                        
                        {/* Key Achievements */}
                        {exp?.achievements && exp?.achievements?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-card-foreground mb-2">Key Achievements:</h4>
                            <ul className="space-y-1">
                              {exp?.achievements?.map((achievement, achIndex) => (
                                <li key={achIndex} className="flex items-start space-x-2 text-sm text-text-secondary">
                                  <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Skills Used */}
                        {exp?.skills && exp?.skills?.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {exp?.skills?.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Experience Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Experience Summary</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{worker?.experience}</div>
                <div className="text-sm text-text-secondary">Years Experience</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-card-foreground">
                    {worker?.projectsCompleted}
                  </div>
                  <div className="text-xs text-text-secondary">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-card-foreground">
                    {worker?.clientsServed}
                  </div>
                  <div className="text-xs text-text-secondary">Clients</div>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Specializations</h3>
            <div className="space-y-2">
              {worker?.specializations?.map((spec, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="Star" size={14} className="text-accent" />
                  <span className="text-sm text-text-secondary">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          {worker?.education && worker?.education?.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Education</h3>
              <div className="space-y-3">
                {worker?.education?.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary pl-3">
                    <h4 className="font-medium text-card-foreground">{edu?.degree}</h4>
                    <p className="text-sm text-text-secondary">{edu?.institution}</p>
                    <p className="text-xs text-text-secondary">{edu?.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Licenses */}
          {worker?.licenses && worker?.licenses?.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Licenses & Certifications</h3>
              <div className="space-y-3">
                {worker?.licenses?.map((license, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="Award" size={16} className="text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium text-card-foreground">{license?.name}</h4>
                      <p className="text-sm text-text-secondary">{license?.issuer}</p>
                      <p className="text-xs text-text-secondary">
                        Expires: {formatDate(license?.expiryDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTab;