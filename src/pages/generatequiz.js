import React, { useState, useEffect } from 'react';
import './generatequiz.css';

// Temporary cache utility functions
const ProfileCache = {
  set: (profile) => {
    const cacheData = {
      profile,
      timestamp: Date.now()
    };
    window.profileCache = cacheData;
  },
  
  get: () => {
    return window.profileCache?.profile || null;
  },
  
  clear: () => {
    window.profileCache = null;
  }
};

// User credentials cache for quiz submission
const UserCache = {
  set: (user) => {
    window.userCredentials = user;
  },
  
  get: () => {
    return window.userCredentials || null;
  },
  
  clear: () => {
    window.userCredentials = null;
  }
};

const FileUpload = ({ onFileUpload, isUploading }) => {
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Resume Skill Analyzer</h1>
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${isUploading ? 'opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold mb-2">
          {isUploading ? 'Processing Resume...' : 'Upload Your Resume'}
        </h3>
        <p className="text-gray-600 mb-4">
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
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              Browse Files
            </label>
            <p className="text-sm text-gray-500 mt-2">Only PDF files are supported</p>
          </>
        )}
        {isUploading && (
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
    </div>
  );
};

// Add Login Component for user authentication
const LoginForm = ({ onLogin, onSkip, isLoggingIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin({ username: username.trim(), password: password.trim() });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Save Results</h2>
        <p className="text-gray-600 mb-6 text-center">
          Login to save your quiz results, or skip to take the quiz without saving.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              disabled={isLoggingIn}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              disabled={isLoggingIn}
            />
          </div>
          
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoggingIn || !username.trim() || !password.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Logging in...' : 'Login & Continue'}
            </button>
            
            <button
              type="button"
              onClick={onSkip}
              disabled={isLoggingIn}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:opacity-50"
            >
              Skip & Take Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileDisplay = ({ profile, onGenerateAssessment, onUploadAnother }) => {
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{profile.name || 'Professional Profile'}</h2>
            <p className="text-gray-600">{profile.email || 'Email not provided'}</p>
          </div>
          <button 
            onClick={onUploadAnother}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Upload Another Resume
          </button>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.skills.map((skill, index) => {
                const level = profile.proficiency && profile.proficiency[skill] ? profile.proficiency[skill] : 'Intermediate';
                const skillStyle = getSkillLevel(level);
                return (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{skill}</span>
                      <span className="text-sm text-gray-600">{level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: skillStyle.width, 
                          backgroundColor: skillStyle.color 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skill Gaps Section */}
        {profile.skill_gaps && profile.skill_gaps.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Areas for Improvement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.skill_gaps.map((gap, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <span className="text-red-700 font-medium">{gap}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Section */}
        {profile.summary && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Experience</h3>
            <div className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">{exp.title || 'Position'}</h4>
                  <p className="text-gray-600">{exp.company || 'Company'}</p>
                  <p className="text-sm text-gray-500">{exp.duration || 'Duration not specified'}</p>
                  {exp.description && (
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Education</h3>
            <div className="space-y-3">
              {profile.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">{edu.degree || 'Degree'}</h4>
                  <p className="text-gray-600">{edu.institution || 'Institution'}</p>
                  <p className="text-sm text-gray-500">{edu.year || 'Year not specified'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <button 
            onClick={onGenerateAssessment}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Generate Skill Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

const StartQuizPage = ({ onStartQuiz, onBackToProfile, isGenerating }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-6xl mb-6">🎯</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Assessment Ready</h2>
        <p className="text-gray-600 mb-8">
          {isGenerating 
            ? 'Generating personalized questions based on your profile...'
            : 'Your personalized skill assessment has been generated and is ready to begin. This assessment will help identify areas for improvement and recommend suitable learning paths.'
          }
        </p>
        
        {isGenerating ? (
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={onStartQuiz}
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              Start Quiz
            </button>
            <br />
            <button 
              onClick={onBackToProfile}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MCQList = ({ onBackToProfile }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if questions are available from the previous generation
    if (window.generatedQuestions && window.generatedQuestions.length > 0) {
      setQuestions(window.generatedQuestions);
      setLoading(false);
    } else {
      // If no questions available, try to fetch from profile
      const profile = ProfileCache.get();
      
      if (!profile) {
        setError('No profile data found. Please upload a resume first.');
        setLoading(false);
        return;
      }

      // Simulate loading questions (in real implementation, fetch from your API)
      setTimeout(() => {
        const mockQuestions = [
          {
            question: "What is the main purpose of Spring Boot?",
            options: [
              "To build web applications",
              "To simplify Spring application development",
              "To manage databases",
              "To create REST APIs"
            ]
          },
          {
            question: "Which HTTP method is used to update a resource in REST?",
            options: ["GET", "POST", "PUT", "DELETE"]
          },
          {
            question: "What does CSS stand for?",
            options: [
              "Computer Style Sheets",
              "Cascading Style Sheets",
              "Creative Style Sheets",
              "Colorful Style Sheets"
            ]
          }
        ];
        setQuestions(mockQuestions);
        setLoading(false);
      }, 1000);
    }
  }, []);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Get user credentials
      const userCredentials = UserCache.get();
      
      if (!userCredentials) {
        alert('No user credentials found. Please login first.');
        return;
      }

      // Format answers according to backend expectations
      const formattedAnswers = questions.map((question, index) => {
        const selectedOptionIndex = answers[index];
        const userAnswer = selectedOptionIndex !== undefined 
          ? question.options[selectedOptionIndex] 
          : '';
        
        return {
          
        
          question: question.question,
          user_answer: userAnswer
        };
      });

      console.log('Submitting quiz with:', {
        user: userCredentials,
        answers: formattedAnswers
      });
      
      const response = await fetch('http://127.0.0.1:8000/quiz/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userCredentials,
          answers: formattedAnswers
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Quiz submission result:', result);
      
      // Show results to user
      let resultMessage = `Assessment completed!\n\nScore: ${result.score}\n\n`;
      if (result.detailed_results && result.detailed_results.length > 0) {
        resultMessage += "Detailed Results:\n";
        result.detailed_results.forEach((item, index) => {
          resultMessage += `${index + 1}. ${item.question}\n`;
          resultMessage += `   Your answer: ${item.your_answer}\n`;
          resultMessage += `   Status: ${item.status}\n\n`;
        });
      }
      
      alert(resultMessage);
      
      // Optionally redirect back to profile or show results
      onBackToProfile();
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert(`Failed to submit assessment: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={onBackToProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const allAnswered = answeredQuestions === totalQuestions;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={onBackToProfile}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Profile
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Skill Assessment</h2>
            <p className="text-gray-600">Answer the following questions to evaluate your skills</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-lg font-semibold text-gray-800">{answeredQuestions}/{totalQuestions}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={index} className={`bg-white border rounded-lg shadow-sm p-6 ${answers[index] !== undefined ? 'border-green-200 bg-green-50' : ''}`}>
            <p className="font-semibold text-lg mb-4 text-gray-800">
              Q{index + 1}. {q.question}
            </p>
            <div className="space-y-3">
              {q.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optIndex}
                    checked={answers[index] === optIndex}
                    onChange={() => handleAnswerChange(index, optIndex)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="mt-8 text-center">
          <div className="mb-4">
            {!allAnswered && (
              <p className="text-orange-600 mb-2">
                Please answer all questions before submitting ({totalQuestions - answeredQuestions} remaining)
              </p>
            )}
          </div>
          <button 
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
              allAnswered && !submitting
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      )}
    </div>
  );
};

// Main App Component with Routing
const Generatequiz = () => {
  const [currentPage, setCurrentPage] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      if (data.profile) {
        setProfile(data.profile);
        ProfileCache.set(data.profile);
        setCurrentPage('profile');
      } else {
        throw new Error('No profile data received from server');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setError('Failed to upload and analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateAssessment = async () => {
    try {
      setIsGeneratingQuiz(true);
      setError(null);
      setCurrentPage('start-quiz');
      
      console.log('Main: Starting assessment generation for profile:', profile);
      
      const response = await fetch('http://127.0.0.1:8000/generate_mcq/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name || 'Anonymous',
          skill_gaps: profile.skill_gaps || [],
          proficiency: profile.proficiency || {}
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('MCQ generation successful:', data);
      
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No valid questions received from server');
      }

      // Store questions globally for the quiz component to access
      window.generatedQuestions = data.questions;
      
      console.log(`Successfully generated ${data.questions.length} questions`);
      setIsGeneratingQuiz(false);

    } catch (error) {
      console.error('Error generating MCQs:', error);
      setError(`Failed to generate assessment questions: ${error.message}`);
      setIsGeneratingQuiz(false);
      setCurrentPage('profile');
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setIsLoggingIn(true);
      
      // Store credentials for later use
      UserCache.set(credentials);
      
      // You could validate credentials here if needed
      console.log('User credentials stored:', credentials);
      
      setCurrentPage('assessment');
      
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSkipLogin = () => {
    // For users who don't want to save results
    UserCache.clear();
    setCurrentPage('assessment');
  };

  const handleStartQuiz = () => {
    if (window.generatedQuestions && window.generatedQuestions.length > 0) {
      // Instead of going directly to assessment, go to login first
      setCurrentPage('login');
    } else {
      setError('No questions available. Please generate assessment first.');
      setCurrentPage('profile');
    }
  };

  const handleBackToProfile = () => {
    setCurrentPage('profile');
    setError(null);
  };

  const handleUploadAnother = () => {
    setCurrentPage('upload');
    setProfile(null);
    setError(null);
    setIsGeneratingQuiz(false);
    ProfileCache.clear();
    UserCache.clear();
    window.generatedQuestions = null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-800 hover:text-red-900 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {currentPage === 'upload' && (
          <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
        )}
        
        {currentPage === 'profile' && profile && (
          <ProfileDisplay 
            profile={profile} 
            onGenerateAssessment={handleGenerateAssessment}
            onUploadAnother={handleUploadAnother}
          />
        )}
        
        {currentPage === 'start-quiz' && (
          <StartQuizPage
            onStartQuiz={handleStartQuiz}
            onBackToProfile={handleBackToProfile}
            isGenerating={isGeneratingQuiz}
          />
        )}

        {currentPage === 'login' && (
          <LoginForm
            onLogin={handleLogin}
            onSkip={handleSkipLogin}
            isLoggingIn={isLoggingIn}
          />
        )}
        
        {currentPage === 'assessment' && (
          <MCQList onBackToProfile={handleBackToProfile} />
        )}
      </div>
    </div>
  );
};

export default Generatequiz;