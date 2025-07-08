import React, { useContext,useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Dashboard.css';
import { ProfileContext } from '../components/ProfileContext';

// Mock components for demonstration
const LearningPathCard = ({ path }) => (
  <div className="learning-path-card">
    <div className="card-header">
      <div className="category-badge">{path.category}</div>
      <div className={`status-indicator ${path.status.toLowerCase().replace(' ', '-')}`}>
        {path.status}
      </div>
    </div>
    <h3 className="card-title">{path.title}</h3>
    <div className="card-meta">
      <span className="time-estimate">{path.estimatedTime}h</span>
    </div>
    <div className="progress-section">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${path.progress}%` }}
        ></div>
      </div>
      <span className="progress-text">{path.progress}%</span>
    </div>
    <button className="continue-btn">
      {path.status === 'Done' ? 'Review' : path.status === 'Pending' ? 'Start' : 'Continue'}
    </button>
  </div>
);




const WorkflowProgress = ({ currentStep }) => (
  <div className="workflow-progress">
    <h3 className="workflow-title">Learning Journey</h3>
    <div className="workflow-steps">
      {['Assessment', 'Planning', 'Learning', 'Practice', 'Certification'].map((step, index) => (
        <div key={index} className={`workflow-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}>
          <div className="step-number">{index + 1}</div>
          <span className="step-label">{step}</span>
        </div>
      ))}
    </div>
  </div>
);

const FileUpload = ({ onFileUpload, isUploading }) => {
  //const { setProfile } = useContext(ProfileContext);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  };


  

  return (
    <div 
      className={`file-upload-zone ${dragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-icon">📄</div>
      <h3 className="upload-title">
        {isUploading ? 'Processing Resume...' : 'Upload Your Resume'}
      </h3>
      <p className="upload-description">
        {isUploading 
          ? 'Analyzing your skills and generating profile...' 
          : 'Drag & drop your PDF resume here or click to browse'
        }
      </p>
      {!isUploading && (
        <>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="file-input"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="upload-button">
            Browse Files
          </label>
          <p className="upload-note">Only PDF files are supported</p>
        </>
      )}
      {isUploading && (
        <div className="upload-spinner"></div>
      )}
    </div>
  );
};

const ProfileDisplay = ({ profile, uploadResponse }) => {
  const getSkillLevel = (level) => {
    const levels = {
      'Beginner': { width: '25%', color: '#ef4444' },
      'Intermediate': { width: '60%', color: '#f59e0b' },
      'Advanced': { width: '85%', color: '#10b981' },
      'Expert': { width: '100%', color: '#3b82f6' }
    };
    return levels[level] || { width: '50%', color: '#6b7280' };
  };

  return (
    <div className="profile-display">
      <div className="profile-header">
        <div className="profile-icon">👤</div>
        <div className="profile-info">
          <h2 className="candidate-name">{profile.name || 'Candidate'}</h2>
          <p className="upload-status">✅ Resume analyzed successfully</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3 className="card-title">
            <span className="card-icon">🎯</span>
            Skill Gaps to Focus On
          </h3>
          <div className="skill-gaps">
            {profile.skill_gaps && profile.skill_gaps.length > 0 ? (
              profile.skill_gaps.map((skill, index) => (
                <div key={index} className="skill-gap-item">
                  <span className="skill-name">{skill}</span>
                  <span className="priority-badge"></span>
                </div>
              ))
            ) : (
              <p className="no-data">No skill gaps identified</p>
            )}
          </div>
        </div>

        <div className="profile-card">
          <h3 className="card-title">
            <span className="card-icon">⭐</span>
            Current Proficiency
          </h3>
          <div className="proficiency-list">
            {profile.proficiency && Object.keys(profile.proficiency).length > 0 ? (
              Object.entries(profile.proficiency).map(([skill, level], index) => {
                const skillData = getSkillLevel(level);
                return (
                  <div key={index} className="proficiency-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill}</span>
                      <span className="skill-level">{level}</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-fill" 
                        style={{ 
                          width: skillData.width, 
                          backgroundColor: skillData.color 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-data">No proficiency data available</p>
            )}
          </div>
        </div>
      </div>

      

      <div className="action-buttons">
        <button className="primary-button">Generate Assesment</button>
        <button className="secondary-button">Download Report</button>
        <button className="tertiary-button">Upload Another Resume</button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [learningPath, setLearningPath] = useState([]);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [userName, setUserName] = useState('Alex');
  const [stats, setStats] = useState({
    totalHours: 12,
    completedCourses: 3,
    streak: 7
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setLearningPath([
        { 
          title: 'AI Foundations', 
          estimatedTime: 5, 
          status: 'In Progress',
          progress: 65,
          category: 'Technology'
        },
        { 
          title: 'React Basics', 
          estimatedTime: 3, 
          status: 'Done',
          progress: 100,
          category: 'Development'
        },
        { 
          title: 'Machine Learning Fundamentals', 
          estimatedTime: 8, 
          status: 'Pending',
          progress: 0,
          category: 'Technology'
        },
        { 
          title: 'Data Visualization', 
          estimatedTime: 4, 
          status: 'In Progress',
          progress: 35,
          category: 'Analytics'
        }
      ]);
      setWorkflowStep(2);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Replace with your actual backend URL
      const response = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        body: formData,
      });
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadResponse(data);
      setProfile(data.profile);
      
    } catch (error) {
      console.error('Upload failed:', error);
      // For demo purposes, show mock data on error
      const mockData = {
        filename: file.name,
        message: "Resume uploaded, parsed, PII scrubbed, profiled successfully",
        file_path: "/uploads/" + file.name,
        profile: {
          name: "John Doe",
          skill_gaps: ["Machine Learning", "Cloud Computing", "DevOps"],
          proficiency: {
            "JavaScript": "Advanced",
            "Python": "Intermediate", 
            "React": "Advanced",
            "SQL": "Intermediate"
          }
        },
        raw_preview: "John Doe Software Engineer with 5 years of experience in web development. Skilled in JavaScript, React, and Python. Looking to expand into machine learning and cloud technologies...",
        scrubbed_preview: "[NAME] Software Engineer with 5 years of experience in web development. Skilled in JavaScript, React, and Python. Looking to expand into machine learning and cloud technologies..."
      };
      setUploadResponse(mockData);
      setProfile(mockData.profile);
    } finally {
      setIsUploading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { 
      title: 'Start Assessment',
      description: 'Take a skill assessment',
      icon: '📊',
      color: 'primary'
    },
    { 
      title: 'Browse Courses',
      description: 'Explore new learning paths',
      icon: '📚',
      color: 'secondary'
    },
    { 
      title: 'View Progress',
      description: 'Check your achievements',
      icon: '🏆',
      color: 'accent'
    },
    { 
      title: 'Get Help',
      description: 'Contact support',
      icon: '💬',
      color: 'neutral'
    }
  ];

  if (isLoading) {
    return (
      <div className="dashboard loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #fafbfc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard.loading {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-container {
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f5f9;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-container p {
          color: #64748b;
          font-weight: 500;
        }

        .dashboard-header {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
        }

        .welcome-section {
          flex: 1;
        }

        .greeting {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .subtitle {
          font-size: 16px;
          color: #64748b;
          font-weight: 500;
        }

        .stats-grid {
          display: flex;
          gap: 16px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          min-width: 100px;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tab-navigation {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 32px;
          display: flex;
          gap: 32px;
        }

        .tab-button {
          background: none;
          border: none;
          padding: 16px 0;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
        }

        .tab-button:hover {
          color: #475569;
        }

        .tab-button.active {
          color: #3b82f6;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #3b82f6;
        }

        .dashboard-content {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section {
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .workflow-progress {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .workflow-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .workflow-steps {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .workflow-step {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          position: relative;
        }

        .workflow-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 12px;
          right: -12px;
          width: 24px;
          height: 2px;
          background: #e2e8f0;
        }

        .workflow-step.completed:not(:last-child)::after {
          background: #22c55e;
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .workflow-step.completed .step-number {
          background: #22c55e;
          color: #ffffff;
        }

        .workflow-step.active .step-number {
          background: #3b82f6;
          color: #ffffff;
        }

        .step-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .workflow-step.completed .step-label,
        .workflow-step.active .step-label {
          color: #0f172a;
          font-weight: 600;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .quick-action {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-action:hover {
          border-color: #cbd5e1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .quick-action.primary:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .quick-action.secondary:hover {
          border-color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
        }

        .quick-action.accent:hover {
          border-color: #f59e0b;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
        }

        .quick-action.neutral:hover {
          border-color: #6b7280;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
        }

        .action-icon {
          font-size: 32px;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-content {
          flex: 1;
        }

        .action-title {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .action-description {
          font-size: 14px;
          color: #64748b;
        }

        .action-arrow {
          font-size: 20px;
          color: #cbd5e1;
          transition: all 0.2s ease;
        }

        .quick-action:hover .action-arrow {
          color: #64748b;
          transform: translateX(4px);
        }

        .learning-paths {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .learning-path-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.2s ease;
        }

        .learning-path-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .category-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-indicator {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-indicator.in-progress {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-indicator.done {
          background: #d1fae5;
          color: #065f46;
        }

        .status-indicator.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .card-meta {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .time-estimate {
          font-weight: 500;
        }

        .progress-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          min-width: 32px;
        }

        .continue-btn {
          width: 100%;
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .continue-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .filter-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          color: #475569;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .progress-overview {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 32px;
          align-items: center;
        }

        .progress-chart {
          text-align: center;
        }

        .chart-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: conic-gradient(#3b82f6 0deg 245deg, #f1f5f9 245deg 360deg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: 0 auto 16px;
        }

        .chart-circle::before {
          content: '';
          position: absolute;
          width: 120px;
          height: 120px;
          background: #ffffff;
          border-radius: 50%;
        }

        .chart-percentage {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          position: relative;
          z-index: 1;
        }

        .progress-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .progress-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .progress-label {
          min-width: 140px;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
        }

        .progress-bar-item {
          flex: 1;
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill-item {
          height: 100%;
          background: #3b82f6;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .progress-value {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          min-width: 50px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 20px;
            padding: 20px;
          }

          .stats-grid {
            justify-content: center;
            flex-wrap: wrap;
          }

          .tab-navigation {
            padding: 0 20px;
            overflow-x: auto;
          }

          .dashboard-content {
            padding: 20px;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .learning-paths {
            grid-template-columns: 1fr;
          }

          .progress-overview {
            grid-template-columns: 1fr;
            gap: 24px;
            text-align: center;
          }

          .progress-item {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .progress-label {
            min-width: auto;
            text-align: center;
          }

          .progress-value {
            text-align: center;
          }
        }
      `}</style>
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1 className="greeting">
            {getGreeting()}! 👋
          </h1>
          <p className="dashboard__subtitle">
            Ready to continue your learning journey?
          </p>
        </div>
        
        <div className="stats-grid">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="stat-card">
              <div className="stat-value">{value}</div>
              <div className="stat-label">
                {key === 'totalHours' ? 'Total Hours' : 
                 key === 'completedCourses' ? 'Completed' : 
                 'Day Streak'}
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          My Courses
        </button>
        <button 
  className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
  onClick={() => {
    setActiveTab('upload');
    navigate('/generate-quiz');  // <-- Redirects to the route
  }}
>
  Upload
</button>

        <button 
          className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </button>
      </div>

      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            <WorkflowProgress currentStep={workflowStep} />
            
            <section className="section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="quick-actions">
                {quickActions.map((action, index) => (
                  <div key={index} className={`quick-action ${action.color}`}>
                    <div className="action-icon">{action.icon}</div>
                    <div className="action-content">
                      <h3 className="action-title">{action.title}</h3>
                      <p className="action-description">{action.description}</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="section">
              <h2 className="section-title">Continue Learning</h2>
              <div className="learning-paths">
                {learningPath.slice(0, 2).map((path, index) => (
                  <LearningPathCard key={index} path={path} />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'courses' && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">All Learning Paths</h2>
              <div className="filter-controls">
                <select className="filter-select">
                  <option>All Categories</option>
                  <option>Technology</option>
                  <option>Development</option>
                  <option>Analytics</option>
                </select>
                <select className="filter-select">
                  <option>All Status</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div className="learning-paths">
              {learningPath.map((path, index) => (
                <LearningPathCard key={index} path={path} />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'upload' && (
          <section className="section">
            <h2 className="section-title">Resume Analysis</h2>
            {!profile ? (
              <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
            ) : (
              <ProfileDisplay profile={profile} uploadResponse={uploadResponse} />
            )}
          </section>
        )}

        {activeTab === 'progress' && (
          <section className="section">
            <h2 className="section-title">Your Progress</h2>
            <div className="progress-overview">
              <div className="progress-chart">
                <div className="chart-circle">
                  <span className="chart-percentage">68%</span>
                </div>
                <p>Overall Progress</p>
              </div>
              <div className="progress-details">
                <div className="progress-item">
                  <span className="progress-label">Courses Started</span>
                  <div className="progress-bar-item">
                    <div className="progress-fill-item" style={{width: '60%'}}></div>
                  </div>
                  <span className="progress-value">6/10</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Courses Completed</span>
                  <div className="progress-bar-item">
                    <div className="progress-fill-item" style={{width: '30%'}}></div>
                  </div>
                  <span className="progress-value">3/10</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Skills Mastered</span>
                  <div className="progress-bar-item">
                    <div className="progress-fill-item" style={{width: '45%'}}></div>
                  </div>
                  <span className="progress-value">9/20</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}