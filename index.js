const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.port || 5100;

app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('Hello World!')
}) 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dxp0i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const productCollection = client.db("mobileBazar").collection("mobile");
  const orderCollection = client.db("mobileBazar").collection("orders");
 
app.get('/products', (req, res) => {
  productCollection.find()
  .toArray((err, items) => {
    res.send(items)
  })
})

app.get('/product/:id', (req, res) => {
  productCollection.find({_id: ObjectId(req.params.id)})
  .toArray( (err, documents) => {
  res.send(documents[0]);
  })
  
})

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('add product: ', newProduct)
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log('add order: ', newOrder)
    orderCollection.insertOne(newOrder)
    .then(result => {
      console.log('inserted count: ', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req, res) => {
    orderCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res) =>{
    productCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
    console.log(req.params.id)
    .then( result => {
      console.log(result.deletedCount)
      res.send(result.deletedCount > 0)
    })
  })

  //client.close();
});


app.listen(port)


