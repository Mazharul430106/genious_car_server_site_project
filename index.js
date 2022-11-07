const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qm6ghoc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async ()=>{
    try{
      const productCollection = client.db('geniousCarDb').collection('products');
      const servicesCollection = client.db('geniousCarDb').collection('services');
      const orderCollection = client.db('geniousCarDb').collection('orders');


      // token api 
       app.post('/jwt',(req, res)=>{
          const user = req.body;
          console.log(user);
       })

        // get all Services data from database
        app.get('/services', async (req, res)=>{
          const query = {};
          const cursor = servicesCollection.find(query);
          const services = await cursor.toArray();
          res.send(services);
        })

        // get one services data from database
        app.get('/services/:id', async (req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const selectedService = await servicesCollection.findOne(query);
          res.send(selectedService);
        })

        // created orders api form database.
        app.post('/orders', async(req, res)=>{
          const order = req.body;
          const result = await orderCollection.insertOne(order);
          res.send(result);
        })

        // get orders api from database.
        app.get('/orders', async(req, res)=>{
          let query = {};
          if(req.query.email){
              query = {
                  email: req.query.email
              }
          }
          const cursor = orderCollection.find(query);
          const orders = await cursor.toArray();
          res.send(orders);
        })

        // update orders api from database.
        app.patch('/orders/:id', async (req, res)=>{
          const id = req.params.id;
          const status = req.body.status;
          const query = {_id: ObjectId(id)};
          const updateDoc = {
            $set: {
              status: status
            }
          }
          const result = await orderCollection.updateOne(query, updateDoc);
          res.send(result)
        })

        // delete orders api from database.
        app.delete('/orders/:id', async (req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await orderCollection.deleteOne(query);
          res.send(result);
        })

    }
    finally{


    }
}
run().catch(err=> {
    console.log(err)
});



app.get('/', (req, res) => {
  res.send('Genious Server Project is Running!')
})

app.listen(port, () => {
  console.log(`Genious Server is Running on port ${port}`)
})