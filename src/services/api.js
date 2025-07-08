// src/services/api.js
const API_BASE = 'https://dummy-api.com'; // Replace with your actual endpoint

export const fetchLearningPath = () =>
  fetch(`${API_BASE}/learning-path`).then(res => res.json());

export const fetchWorkflowStatus = () =>
  fetch(`${API_BASE}/workflow-status`).then(res => res.json());

export const searchUsers = (filters) =>
  fetch(`${API_BASE}/admin/search-users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  }).then(res => res.json());

export const fetchAgentStatus = () =>
  fetch(`${API_BASE}/admin/agent-status`).then(res => res.json());

export const generateReport = (params) =>
  fetch(`${API_BASE}/admin/generate-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then(res => res.json());
