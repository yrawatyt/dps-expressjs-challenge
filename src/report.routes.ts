// routes/reportRoutes.ts
import express from 'express';
import db from '../services/db.service';

const router = express.Router();

interface Report {
  id: number;
  text: string;
  project_id: number;
}

// Get all reports
router.get('/', (req, res) => {
  const reports = db.query('SELECT * FROM reports') as Report[];
  res.json(reports);
});

// Get a specific report
router.get('/:id', (req, res) => {
  const report = db.query('SELECT * FROM reports WHERE id = :id', { id: req.params.id })[0] as Report | undefined;
  if (report) {
    res.json(report);
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

// Create a new report
router.post('/', (req, res) => {
  const { text, project_id } = req.body;
  const result = db.run('INSERT INTO reports (text, project_id) VALUES (:text, :project_id)', { text, project_id });
  res.status(201).json({ id: result.lastInsertRowid, text, project_id });
});

// Update a report
router.put('/:id', (req, res) => {
  const { text, project_id } = req.body;
  db.run('UPDATE reports SET text = :text, project_id = :project_id WHERE id = :id', { id: req.params.id, text, project_id });
  res.json({ id: Number(req.params.id), text, project_id });
});

// Delete a report
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM reports WHERE id = :id', { id: req.params.id });
  res.status(204).send();
});

// Special endpoint: Get reports where a word appears at least three times
router.get('/frequent-word/:word', (req, res) => {
  const word = req.params.word.toLowerCase();
  const reports = db.query('SELECT * FROM reports WHERE LOWER(text) LIKE :word', { word: `%${word}%` }) as Report[];
  
  const frequentReports = reports.filter(report => {
    const wordCount = (report.text.toLowerCase().match(new RegExp(word, 'g')) || []).length;
    return wordCount >= 3;
  });

  res.json(frequentReports);
});

export default router;