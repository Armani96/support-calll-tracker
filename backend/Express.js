const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

app.get('/records', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            const records = JSON.parse(data);
            res.json({ records: records });
        }
    });
});

app.post('/records', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            const records = JSON.parse(data);
            const newRecord = req.body;
            records.push(newRecord);
            fs.writeFile(DATA_FILE, JSON.stringify(records), (err) => {
                if (err) {
                    res.status(500).send('Error writing data file');
                } else {
                    res.status(201).json(newRecord);
                }
            });
        }
    });
});

app.put('/records/:id', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            let records = JSON.parse(data);
            const updatedRecord = req.body;
            records = records.map(record => record.id === req.params.id ? updatedRecord : record);
            fs.writeFile(DATA_FILE, JSON.stringify(records), (err) => {
                if (err) {
                    res.status(500).send('Error writing data file');
                } else {
                    res.status(200).json(updatedRecord);
                }
            });
        }
    });
});

app.delete('/records/:id', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            let records = JSON.parse(data);
            records = records.filter(record => record.id !== req.params.id);
            fs.writeFile(DATA_FILE, JSON.stringify(records), (err) => {
                if (err) {
                    res.status(500).send('Error writing data file');
                } else {
                    res.status(200).json({ message: 'Record deleted' });
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
