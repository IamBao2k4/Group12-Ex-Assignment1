import express from 'express';
import supabase from './supabase/supabaseClient.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/students', async (req, res) => {
  const { data: users, error } = await supabase
    .from('student')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(users);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});