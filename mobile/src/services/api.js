// Update this to your server's URL
// For local development with Expo Go on a physical device,
// use your computer's local IP (e.g., http://192.168.1.100:3001)
// For iOS simulator, http://localhost:3001 works fine
const API_BASE = 'http://localhost:3001/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

// Chat
export async function sendMessage(message, conversationId = 'main-chat') {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversationId }),
  });
}

export async function clearConversation(conversationId = 'main-chat') {
  return request(`/chat/${conversationId}`, { method: 'DELETE' });
}

// Email
export async function draftEmail({ context, tone, recipientName, subject }) {
  return request('/email/draft', {
    method: 'POST',
    body: JSON.stringify({ context, tone, recipientName, subject }),
  });
}

export async function replyToEmail({ originalEmail, instructions, tone }) {
  return request('/email/reply', {
    method: 'POST',
    body: JSON.stringify({ originalEmail, instructions, tone }),
  });
}

// Reservations
export async function findRestaurant({ cuisine, location, occasion, partySize, budget, preferences }) {
  return request('/reservations/find', {
    method: 'POST',
    body: JSON.stringify({ cuisine, location, occasion, partySize, budget, preferences }),
  });
}

// Tasks
export async function getTasks() {
  return request('/tasks');
}

export async function createTask({ title, description, priority, category, dueDate }) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description, priority, category, dueDate }),
  });
}

export async function updateTask(id, updates) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' });
}
