// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

app.get('/records', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            try {
                const records = JSON.parse(data).records;
                if (!Array.isArray(records)) {
                    throw new Error('Data format is incorrect');
                }
                res.json({ records });
            } catch (error) {
                res.status(500).send('Error parsing data file');
            }
        }
    });
});

app.post('/records', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            try {
                const recordsData = JSON.parse(data);
                if (!Array.isArray(recordsData.records)) {
                    throw new Error('Data format is incorrect');
                }
                const newRecord = req.body;
                newRecord.id = String(Date.now());
                recordsData.records.push(newRecord);
                fs.writeFile(DATA_FILE, JSON.stringify(recordsData), (err) => {
                    if (err) {
                        res.status(500).send('Error writing data file');
                    } else {
                        res.status(201).json(newRecord);
                    }
                });
            } catch (error) {
                res.status(500).send('Error parsing data file');
            }
        }
    });
});

app.put('/records/:id', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            try {
                const recordsData = JSON.parse(data);
                if (!Array.isArray(recordsData.records)) {
                    throw new Error('Data format is incorrect');
                }
                const updatedRecord = req.body;
                recordsData.records = recordsData.records.map(record => record.id === req.params.id ? updatedRecord : record);
                fs.writeFile(DATA_FILE, JSON.stringify(recordsData), (err) => {
                    if (err) {
                        res.status(500).send('Error writing data file');
                    } else {
                        res.status(200).json(updatedRecord);
                    }
                });
            } catch (error) {
                res.status(500).send('Error parsing data file');
            }
        }
    });
});

app.delete('/records/:id', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
        } else {
            try {
                const recordsData = JSON.parse(data);
                if (!Array.isArray(recordsData.records)) {
                    throw new Error('Data format is incorrect');
                }
                recordsData.records = recordsData.records.filter(record => record.id !== req.params.id);
                fs.writeFile(DATA_FILE, JSON.stringify(recordsData), (err) => {
                    if (err) {
                        res.status(500).send('Error writing data file');
                    } else {
                        res.status(200).json({ message: 'Record deleted' });
                    }
                });
            } catch (error) {
                res.status(500).send('Error parsing data file');
            }
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
