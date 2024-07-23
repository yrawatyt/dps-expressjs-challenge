import express from 'express';
import bodyParser from 'body-parser';
import projectRoutes from './routes/project.routes';
import reportRoutes from './routes/report.routes';

const app = express();g
const PORT = 3000;

app.use(bodyParser.json());

app.use('/projects', projectRoutes);
app.use('/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

