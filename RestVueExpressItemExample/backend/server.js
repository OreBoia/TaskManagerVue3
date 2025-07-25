const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json())

let items = [
    {id: 1, name: 'item1'},
    {id: 2, name: 'item2'},
];

app.get('/items', (req, res) => 
    {
        res.json(items)
    })

app.post('/items', (req, res) => {

    const name = req.body.name;
    const id = req.body.id;
    console.log(`Body inviato: `, req.body)
    if(!name)
        return res.status(400).json({error: 'Name is required'});

    const newItem = {id: items.length + 1, name: name};

    items.push(newItem)

    res.status(201).json(newItem)
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
