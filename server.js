const express = require('express'); 
const app = express();
const port = process.env.PORT || 4000; 
const merchant_model = require('./contragent_model.ts')

app.listen(port, () => console.log(`Listening on port ${port}`)); 

app.use(express.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();});

app.get('/m', (req, res) => {
  merchant_model.getContragents()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })})

app.get('/cleardb', (req,res)=>{
  merchant_model.clearDatabase()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })})

  app.post('/times', (req, res) => {
      merchant_model.getTimeData(req.body)
      .then(response => {
        res.status(200).send(response);
        console.log(req.body,response)
      })
      .catch(error => {
        res.status(500).send(error);
      })})
      
  app.post('/contragents', (req, res) => {
    merchant_model.createContragent(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })})

  app.put('/merchants/update', (req, res) => {
    merchant_model.updateContragent(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })})


