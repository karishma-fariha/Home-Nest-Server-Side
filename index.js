const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
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

app.get('/', (req, res) => {
    res.send('home nest is running')
})


async function run() {
    try {
        await client.connect();

        const db = client.db('home_nest');
        const propertiesCollection = db.collection('properties');
        //   create products
        app.post('/properties', async (req, res) => {
            const newProperty = req.body;
            const result = await propertiesCollection.insertOne(newProperty);
            res.send(result);
        })
        // update property
        app.patch('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const updateProperty = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    name: updateProperty.name,
                    price: updateProperty.price
                }
            }
            const result = await propertiesCollection.updateOne(query, update)
            res.send(result)
        })

        // delete property

        app.delete('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await propertiesCollection.deleteOne(query)
            res.send(result)
        })
        // get property

        app.get('/properties', async (req, res) => {
            const cursor = propertiesCollection.find().sort({ created_at: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await propertiesCollection.findOne(query);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("pinged your deployment.You successfully connected to MongoDB!")
    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`home nest is running on port: ${port}`)
})