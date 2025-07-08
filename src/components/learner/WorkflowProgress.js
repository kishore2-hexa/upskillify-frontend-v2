import React, { useState, useEffect } from 'react';
import './WorkflowProgress.css';

const steps = [
  { 
    label: 'Profile Loaded', 
    icon: '👤',
    description: 'Your profile information has been loaded'
  },
  { 
    label: 'Assessment Pending', 
    icon: '📋',
    description: 'Skill assessment is ready to begin'
  },
  { 
    label: 'Assessment Completed', 
    icon: '✅',
    description: 'Skills have been evaluated successfully'
  },
  { 
    label: 'Recommendations Generated', 
    icon: '🎯',
    description: 'Personalized learning paths created'
  },
  { 
    label: 'Learning In Progress', 
    icon: '🚀',
    description: 'Active learning journey underway'
  }
];

export default function WorkflowProgress({ currentStep }) {
  const [animatedStep, setAnimatedStep] = useState(-1);
  const [hoveredStep, setHoveredStep] = useState(null);

  useEffect(() => {
    // Animate steps progressively
    let timer;
    if (animatedStep < currentStep) {
      timer = setTimeout(() => {
        setAnimatedStep(prev => prev + 1);
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [animatedStep, currentStep]);

  useEffect(() => {
    setAnimatedStep(-1);
  }, [currentStep]);

  return (
    <div className="workflow-progress">
      <div className="workflow-progress__header">
        <h3 className="workflow-progress__title">Learning Journey Progress</h3>
        <div className="workflow-progress__stats">
          <span className="progress-stat">
            {currentStep + 1} of {steps.length} Complete
          </span>
          <div className="progress-percentage">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </div>
        </div>
      </div>

      <div className="workflow-progress__container">
        <div className="workflow-progress__track">
          <div 
            className="workflow-progress__fill"
            style={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%` 
            }}
          ></div>
        </div>

        <div className="workflow-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`workflow-step 
                ${index <= currentStep ? 'workflow-step--completed' : ''} 
                ${index === currentStep ? 'workflow-step--current' : ''}
                ${index <= animatedStep ? 'workflow-step--animated' : ''}
                ${hoveredStep === index ? 'workflow-step--hovered' : ''}
              `}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="workflow-step__indicator">
                <div className="workflow-step__icon">
                  {index <= currentStep ? (
                    <div className="step-icon step-icon--completed">
                      <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="step-icon step-icon--pending">
                      <span className="step-number">{index + 1}</span>
                    </div>
                  )}
                </div>
                
                {index === currentStep && (
                  <div className="workflow-step__pulse"></div>
                )}
              </div>

              <div className="workflow-step__content">
                <div className="workflow-step__label">{step.label}</div>
                <div className="workflow-step__emoji">{step.icon}</div>
              </div>

              {hoveredStep === index && (
                <div className="workflow-step__tooltip">
                  <div className="tooltip-content">
                    <strong>{step.label}</strong>
                    <p>{step.description}</p>
                  </div>
                  <div className="tooltip-arrow"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="workflow-progress__current-step">
        <div className="current-step-card">
          <div className="current-step-icon">{steps[currentStep]?.icon}</div>
          <div className="current-step-info">
            <h4>Current Step</h4>
            <p>{steps[currentStep]?.label}</p>
            <span className="current-step-description">
              {steps[currentStep]?.description}
            </span>
          </div>
          <div className="current-step-action">
            {currentStep < steps.length - 1 && (
              <button className="btn-next">Continue</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}