import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Mail, RotateCcw, Users, Activity, BarChart3, Settings, Bell, ChevronDown, ChevronRight, Eye, Edit, Trash2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
   
import './AdminConsole.css';

export default function AdminConsole() {
  const [filters, setFilters] = useState({ skill: '', department: '', role: '', status: '' });
  const [results, setResults] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [reportMessage, setReportMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminStats, setAdminStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    completedAssessments: 634,
    systemHealth: 98.5
  });

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        const mockResults = [
          { id: 1, name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'Engineering', role: 'Senior Developer', status: 'Active', lastLogin: '2024-06-23', skillGaps: ['React', 'AWS'], completedCourses: 5, totalCourses: 12, avatar: 'SJ' },
          { id: 2, name: 'Michael Chen', email: 'michael.c@company.com', department: 'Marketing', role: 'Marketing Manager', status: 'Active', lastLogin: '2024-06-22', skillGaps: ['Data Analytics', 'SEO'], completedCourses: 3, totalCourses: 8, avatar: 'MC' },
          { id: 3, name: 'Emily Rodriguez', email: 'emily.r@company.com', department: 'Design', role: 'UX Designer', status: 'Inactive', lastLogin: '2024-06-15', skillGaps: ['Figma', 'User Research'], completedCourses: 7, totalCourses: 10, avatar: 'ER' },
          { id: 4, name: 'David Park', email: 'david.p@company.com', department: 'Engineering', role: 'DevOps Engineer', status: 'Active', lastLogin: '2024-06-23', skillGaps: ['Kubernetes', 'Monitoring'], completedCourses: 8, totalCourses: 15, avatar: 'DP' },
          { id: 5, name: 'Lisa Wang', email: 'lisa.w@company.com', department: 'Sales', role: 'Sales Representative', status: 'Active', lastLogin: '2024-06-21', skillGaps: ['CRM', 'Negotiation'], completedCourses: 4, totalCourses: 9, avatar: 'LW' }
        ];
        
        let filteredResults = mockResults.filter(user => {
          return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 user.department.toLowerCase().includes(searchTerm.toLowerCase());
        });

        setResults(filteredResults);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Search failed:', error);
      setIsLoading(false);
    }
  };

  const handleReport = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setReportMessage('Report generated successfully! 📊 Check your email for detailed analysis.');
        setIsLoading(false);
        setTimeout(() => setReportMessage(''), 5000);
      }, 2000);
    } catch (error) {
      console.error('Report generation failed:', error);
      setIsLoading(false);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return;
    
    const actions = {
      export: `📊 Exporting data for ${selectedUsers.length} selected users...`,
      message: `📧 Sending notifications to ${selectedUsers.length} selected users...`,
      reset: `🔄 Resetting progress for ${selectedUsers.length} selected users...`
    };
    
    setReportMessage(actions[action] || '');
    setTimeout(() => setReportMessage(''), 3000);
    setSelectedUsers([]);
  };

  useEffect(() => {
    setAgentData([
      { 
        agent: 'ProfileAgent', 
        queueLength: 4, 
        latency: 120, 
        errorRate: 1.2, 
        status: 'healthy',
        throughput: 95.2,
        uptime: 99.8,
        icon: '👤'
      },
      { 
        agent: 'AssessmentAgent', 
        queueLength: 2, 
        latency: 180, 
        errorRate: 0.8, 
        status: 'healthy',
        throughput: 87.5,
        uptime: 99.9,
        icon: '📋'
      },
      { 
        agent: 'RecommendationAgent', 
        queueLength: 7, 
        latency: 250, 
        errorRate: 2.1, 
        status: 'warning',
        throughput: 78.3,
        uptime: 98.5,
        icon: '🎯'
      },
      { 
        agent: 'ProgressAgent', 
        queueLength: 1, 
        latency: 95, 
        errorRate: 0.3, 
        status: 'healthy',
        throughput: 98.7,
        uptime: 99.95,
        icon: '📈'
      }
    ]);

    handleSearch();
  }, [searchTerm]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'agents', label: 'System Agents', icon: Activity },
    { id: 'reports', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="admin-console">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="main-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="main-title">
                <Settings className="title-icon" />
                Admin Console
              </h1>
              <p className="subtitle">Manage users, monitor system health, and generate reports</p>
            </div>
            
            <div className="header-right">
              <div className="notification-bell">
                <Bell className="bell-icon" />
                <span className="notification-badge">3</span>
              </div>
              
              {/* Stats Overview */}
              <div className="stats-grid">
                {Object.entries(adminStats).map(([key, value]) => (
                  <div key={key} className="stat-card">
                    <div className="stat-value">
                      {typeof value === 'number' && value > 100 ? value.toLocaleString() : value}
                      {key === 'systemHealth' && '%'}
                    </div>
                    <div className="stat-label">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Success/Error Messages */}
        {reportMessage && (
          <div className="message-banner">
            <div className="message-content">
              <CheckCircle className="message-icon" />
              <p>{reportMessage}</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="tab-navigation">
          <div className="tab-container">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className="tab-icon" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <div className="tab-indicator"></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="tab-content">
            {/* Search and Filters */}
            <div className="search-section">
              <div className="search-header">
                <div className="search-input-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or department..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <button
                  className="filter-toggle"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="filter-icon" />
                  Advanced Filters
                  {showFilters ? <ChevronDown className="chevron" /> : <ChevronRight className="chevron" />}
                </button>
              </div>
              
              {showFilters && (
                <div className="filters-panel">
                  <div className="filter-grid">
                    <input
                      type="text"
                      placeholder="Skill Gap"
                      className="filter-input"
                      value={filters.skill}
                      onChange={e => setFilters({ ...filters, skill: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Department"
                      className="filter-input"
                      value={filters.department}
                      onChange={e => setFilters({ ...filters, department: e.target.value })}
                    />
                    <select
                      className="filter-select"
                      value={filters.role}
                      onChange={e => setFilters({ ...filters, role: e.target.value })}
                    >
                      <option value="">All Roles</option>
                      <option value="Senior Developer">Senior Developer</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="UX Designer">UX Designer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                    </select>
                    <select
                      className="filter-select"
                      value={filters.status}
                      onChange={e => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="filter-actions">
                    <button
                      className="primary-button"
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      <Search className="button-icon" />
                      {isLoading ? 'Searching...' : 'Search Users'}
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => setFilters({ skill: '', department: '', role: '', status: '' })}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="bulk-actions">
                <div className="bulk-info">
                  <span className="selected-count">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="bulk-buttons">
                  <button
                    className="bulk-button export"
                    onClick={() => handleBulkAction('export')}
                  >
                    <Download className="bulk-icon" />
                    Export
                  </button>
                  <button
                    className="bulk-button message"
                    onClick={() => handleBulkAction('message')}
                  >
                    <Mail className="bulk-icon" />
                    Message
                  </button>
                  <button
                    className="bulk-button reset"
                    onClick={() => handleBulkAction('reset')}
                  >
                    <RotateCcw className="bulk-icon" />
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="users-table-container">
              <div className="table-header">
                <h3 className="table-title">User Directory</h3>
                <span className="user-count">{results.length} users found</span>
              </div>
              
              <div className="table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th className="checkbox-column">
                        <input
                          type="checkbox"
                          className="table-checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(results.map(user => user.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </th>
                      <th>User</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Skill Gaps</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((user) => (
                      <tr key={user.id} className="user-row">
                        <td>
                          <input
                            type="checkbox"
                            className="table-checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelection(user.id)}
                          />
                        </td>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {user.avatar}
                            </div>
                            <div className="user-details">
                              <div className="user-name">{user.name}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="department-badge">{user.department}</span>
                        </td>
                        <td>
                          <span className="role-text">{user.role}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="progress-container">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${(user.completedCourses / user.totalCourses) * 100}%` }}
                              ></div>
                            </div>
                            <div className="progress-text">
                              {user.completedCourses}/{user.totalCourses}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="skill-gaps">
                            {user.skillGaps.slice(0, 2).map((skill, index) => (
                              <span key={index} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                            {user.skillGaps.length > 2 && (
                              <span className="skill-tag more">
                                +{user.skillGaps.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="last-login">
                          {user.lastLogin}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-button view">
                              <Eye className="action-icon" />
                            </button>
                            <button className="action-button edit">
                              <Edit className="action-icon" />
                            </button>
                            <button className="action-button delete">
                              <Trash2 className="action-icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System Agents Tab */}
        {activeTab === 'agents' && (
          <div className="tab-content">
            <div className="agents-section">
              <div className="section-header">
                <h3 className="section-title">Agentic Framework Health</h3>
                <p className="section-subtitle">Monitor the performance and health of system agents</p>
              </div>
              
              <div className="agents-grid">
                {agentData.map((agent, index) => (
                  <div key={index} className="agent-card">
                    <div className="agent-header">
                      <div className="agent-info">
                        <span className="agent-icon">{agent.icon}</span>
                        <h4 className="agent-name">{agent.agent}</h4>
                      </div>
                      <div className={`agent-status ${agent.status}`}>
                        {getStatusIcon(agent.status)}
                        <span>{agent.status}</span>
                      </div>
                    </div>
                    
                    <div className="agent-metrics">
                      <div className="metric">
                        <span className="metric-label">Queue</span>
                        <span className="metric-value">{agent.queueLength}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Latency</span>
                        <span className="metric-value">{agent.latency}ms</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Error Rate</span>
                        <span className="metric-value">{agent.errorRate}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Uptime</span>
                        <span className="metric-value">{agent.uptime}%</span>
                      </div>
                    </div>
                    
                    <div className="agent-performance">
                      <div className="performance-label">
                        <span>Throughput</span>
                        <span>{agent.throughput}%</span>
                      </div>
                      <div className="performance-bar">
                        <div
                          className={`performance-fill ${agent.status}`}
                          style={{ width: `${agent.throughput}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="tab-content">
            <div className="reports-section">
              <div className="section-header">
                <h3 className="section-title">Generate Reports & Analytics</h3>
                <p className="section-subtitle">Create comprehensive reports and insights</p>
              </div>
              
              <div className="reports-grid">
                <div className="report-card blue">
                  <div className="report-icon">📊</div>
                  <h4 className="report-title">User Analytics</h4>
                  <p className="report-description">
                    Comprehensive analysis of user behavior, progress, and engagement metrics.
                  </p>
                  <button
                    className="report-button"
                    onClick={handleReport}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ Generating...' : 'Generate Report'}
                  </button>
                </div>
                
                <div className="report-card green">
                  <div className="report-icon">📈</div>
                  <h4 className="report-title">System Performance</h4>
                  <p className="report-description">
                    Detailed metrics on system performance, agent health, and operational efficiency.
                  </p>
                  <button
                    className="report-button"
                    onClick={handleReport}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ Generating...' : 'Generate Report'}
                  </button>
                </div>
                
                <div className="report-card purple">
                  <div className="report-icon">🎯</div>
                  <h4 className="report-title">Learning Outcomes</h4>
                  <p className="report-description">
                    Analysis of learning effectiveness, skill development, and course completion rates.
                  </p>
                  <button
                    className="report-button"
                    onClick={handleReport}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ Generating...' : 'Generate Report'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}