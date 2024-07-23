// routes/projectRoutes.ts
import express from 'express';
import db from '../services/db.service';

const router = express.Router();

// Get all projects
router.get('/', (req, res) => {
  const projects = db.query('SELECT * FROM projects');
  res.json(projects);
});

// Get a specific project
router.get('/:id', (req, res) => {
  const project = db.query('SELECT * FROM projects WHERE id = :id', { id: req.params.id })[0];
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// Create a new project
router.post('/', (req, res) => {
  const { name, description } = req.body;
  const result = db.run('INSERT INTO projects (name, description) VALUES (:name, :description)', { name, description });
  res.status(201).json({ id: result.lastInsertRowid, name, description });
});

// Update a project
router.put('/:id', (req, res) => {
  const { name, description } = req.body;
  db.run('UPDATE projects SET name = :name, description = :description WHERE id = :id', { id: req.params.id, name, description });
  res.json({ id: req.params.id, name, description });
});

// Delete a project
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM projects WHERE id = :id', { id: req.params.id });
  res.status(204).send();
});

export default router;