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
        //   create properties
        app.post('/properties', async (req, res) => {
            const newProperty = req.body;

            newProperty.created_at = new Date();

            const result = await propertiesCollection.insertOne(newProperty);
            res.send(result);
        })

        // reviews

        app.post('/reviews',async(req,res)=>{
            try{
                const review =req.body;
                review.created_at = new Date();
                const result = await db.collection('reviews').insertOne(review);
                res.send(result);
            }
            catch(err){
                console.log(err);
                res.status(500).send({error: 'Failed to add review'})
            }
        })


        // get 6 property for home page
        app.get('/properties/home', async (req, res) => {
            const result = await propertiesCollection.find().sort({ created_at: -1 }).limit(6).toArray();
            res.send(result);
        })



        // update property
        app.patch('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const updateProperty = req.body;

            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    title: updateProperty.title,
                    description: updateProperty.description,
                    category: updateProperty.category,
                    price: updateProperty.price,
                    location: updateProperty.location,
                    image: updateProperty.image

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
        // get all property

        app.get('/properties', async (req, res) => {
            const userEmail = req.query.userEmail;

            let filter = {};

            if (userEmail) {
                filter.userEmail = userEmail;
            }

            const cursor = propertiesCollection
                .find(filter)
                .sort({ created_at: -1 });

            const result = await cursor.toArray();
            res.send(result);
        });

        // get a single property
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