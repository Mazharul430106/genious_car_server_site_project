const express = require('express');
const app = express();
const cors = require('cors');
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