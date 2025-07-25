const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
const port = 8080;

app.use(cors({
    origin: 'http://localhost:5173', // Permetti richieste dal frontend Vue
}));
app.use(express.json()); // Usa il parser JSON integrato di Express

let tasks = [
    { id: 1, title: 'Studiare Vue.js', description: 'Completare il tutorial di Vue 3', completed: false},
    { id: 2, title: 'Implementare API', description: 'Creare le API REST per il task manager', completed: false },
];

// GET lista tasks
app.get('/api/task', async (req, res) => {
    try {
        console.log('Tentativo di recupero tasks...');
        const [rows] = await db.query('SELECT * FROM tasks');
        console.log('Tasks recuperate:', rows);
        res.json(rows);
    } catch (error) {
        console.error('Errore GET tasks - Dettagli completi:', error);
        console.error('Errore message:', error.message);
        console.error('Errore code:', error.code);
        res.status(500).json({ error: 'Errore nel recupero tasks' });
    }
});

// POST aggiungi task
app.post('/api/task', async (req, res) => {
    const { title, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
            [title, description, false]
        );
        const newTask = { id: result.insertId, title, description, completed: false };
        res.json(newTask);
    } catch (error) {
        console.error('Errore POST task', error);
        res.status(500).json({ error: 'Errore creazione task' });
    }
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});