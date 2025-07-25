const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();

const port = 8080;

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json())
// app.use(bodyParser.json())

let items = [
    {id: 1, name: 'item1'},
    {id: 2, name: 'item2'},
];

app.get('/items', async (req, res) => 
    {
        try
        {
            console.log('Tentativo di recupero item...')

            const [rows] = await db.query('SELECT id, nome FROM items')
            
            console.log('Items recuperati:', rows)

            res.json(rows)
        }
        catch(err)
        {
            console.error('Errore GET items - dettagli completi: ', err);
            console.error('Error message: ', err.message);
            console.error('Error code:', err.code);
            res.status(500).json({error: 'Errore nel recuper items'});
        }
    })

app.post('/items', async (req, res) => {

    const name = req.body.name;
    console.log(`Body inviato: `, req.body)

    if(!name)
        return res.status(400).json({error: 'Name is required'});

    try
    {
        const [result] = await db.query('INSERT INTO items (nome) VALUES (?)', [name]);
        
        const newItem = {id: result.insertId, name: name};
        res.status(201).json(newItem)
    }
    catch(error)
    {
        console.error('Errore POST items', error);
        res.status(500).json({ error: 'Errore creazione items' });
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
