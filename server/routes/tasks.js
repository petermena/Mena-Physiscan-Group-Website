const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory task store
const tasks = new Map();

// Get all tasks
router.get('/', (req, res) => {
  const allTasks = Array.from(tasks.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json({ tasks: allTasks });
});

// Create a task
router.post('/', (req, res) => {
  const { title, description, priority, dueDate, category } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = {
    id: uuidv4(),
    title,
    description: description || '',
    priority: priority || 'medium',
    category: category || 'general',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.set(task.id, task);
  res.status(201).json({ task });
});

// Update a task
router.patch('/:id', (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updates = req.body;
  const updatedTask = { ...task, ...updates, id: task.id };
  tasks.set(task.id, updatedTask);
  res.json({ task: updatedTask });
});

// Delete a task
router.delete('/:id', (req, res) => {
  if (!tasks.has(req.params.id)) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.delete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
