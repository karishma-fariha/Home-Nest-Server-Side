const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion,  } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middle ware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@hero.3n4q6b5.mongodb.net/?appName=Hero`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/',(req,res)=>{
    res.send('home nest is running')
})


async function run(){
try{
    await client.connect();

    const db =client.db('home_nest');
    const propertiesCollection =db.collection('properties');
//   create products
    app.post('/properties',async(req,res)=>{
        const newProperty = req.body;
        const result = await propertiesCollection.insertOne(newProperty);
        res.send(result);
    })


   


    await client.db("admin").command({ping: 1});
    console.log("pinged your deployment.You successfully connected to MongoDB!")
}
finally{

}
}
run().catch(console.dir)

app.listen(port,()=>{
    console.log(`home nest is running on port: ${port}`)
})