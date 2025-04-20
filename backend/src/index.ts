import express from 'express';
import cors from 'cors'; // Adicione esta importação
import lojaRoutes from './routes/lojaRoutes';

const app = express();

app.use(cors()); // Adicione esta linha
app.use(express.json());
app.use(lojaRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});