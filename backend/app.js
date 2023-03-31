const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const app = express();

app.use(express.json());

var cors = require('cors')
app.use(cors({'origin': 'http://localhost:4200'}))  // this gives angular app running on 4200 access the backend express app.

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const data = require('./data.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ messege: error.messege})
  }
});

// GET a single product
app.get('/api/products/:id', (req, res) => {
  try {
    const data = require('./data.json');
    const singleData = data.find(data => data.productId == req.params.id );
    if (!singleData) return res.status(404).send('The data with the given ID was not found.');
    res.status(200).json(singleData);
  } catch (error) {
    res.status(500).json({ messege: error.messege})
  }
  
});

// POST a new product
app.post('/api/add-product', (req, res) => {
  const data = require('./data.json');
  try {
    const developers = [
      ...(req.body.developer1 ? [req.body.developer1] : []),
      ...(req.body.developer2 ? [req.body.developer2] : []),
      ...(req.body.developer3 ? [req.body.developer3] : []),
      ...(req.body.developer4 ? [req.body.developer4] : []),
      ...(req.body.developer5 ? [req.body.developer5] : []),
    ];
    const newData = {
      productId: uuidv4(),
      productName: req.body.productName,
      productOwnerName: req.body.productOwnerName,
      developers: developers,
      scrumMasterName: req.body.scrumMasterName,
      startDate: req.body.startDate,
      methodology: req.body.methodology
    };
    data.push(newData);
    fs.writeFile("data.json", JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log("done writing....");
    });
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ messege: error.messege })
  }
});

// PUT (update) an existing product
app.put('/api/products/:id', (req, res) => {
try {
    const data = require('./data.json');
    const singleData = data.find(data => data.productId == req.params.id);
    if (!singleData) return res.status(404).send('The data with the given ID was not found.');
    const developers = [
      ...(req.body.developer1 ? [req.body.developer1] : []),
      ...(req.body.developer2 ? [req.body.developer2] : []),
      ...(req.body.developer3 ? [req.body.developer3] : []),
      ...(req.body.developer4 ? [req.body.developer4] : []),
      ...(req.body.developer5 ? [req.body.developer5] : []),
    ];
    singleData.productName = req.body.productName;
    singleData.productOwnerName = req.body.productOwnerName;
    singleData.developers = developers;
    singleData.scrumMasterName = req.body.scrumMasterName;
    singleData.startDate = req.body.startDate;
    singleData.methodology = req.body.methodology;
    
    fs.writeFile("data.json", JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log("done writing....");
    });
    res.status(200).json(singleData);
  } catch (error) {
    res.status(400).json({ message: error.message})
  }
});

// DELETE an existing product
app.delete('/api/products/:id', (req, res) => {
try {
    const data = require('./data.json');
    const singleData = data.find(data => data.productId == req.params.id);
    if (!singleData) return res.status(404).send('The data with the given ID was not found.');
  
    const index = data.indexOf(singleData);
    data.splice(index, 1);
  
    fs.writeFile("data.json", JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log("done writing....");
    });
    res.status(200).json(singleData);
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
});

app.use(
  '/api/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
