const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nklmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


async function run() {
    try {
        await client.connect();
        console.log('Connected Mongo Successfully');
        const database = client.db('Drones_web');
        const productsCollection = database.collection('products');
        const selectedCollection = database.collection('selected_products')
        const usersCollection = database.collection('users');



        // add data to cart collection with additional info
        app.post("/products/add", async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products);
            res.json(result);
        });

        // add data to cart collection with additional info
        app.post("/product/add", async (req, res) => {
            const product = req.body;
            const result = await selectedCollection.insertOne(product);
            res.json(result);
        });


        //Get Full API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        //GET selected Full API
        app.get('/prod', async (req, res) => {
            const cursor = selectedCollection.find({});
            const prod = await cursor.toArray();
            res.send(prod);
        })

        // Get Single Item
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await productsCollection.findOne(query);
            res.json(service)
        });

        //// load added data according to user id get api
        app.get("/product/:uid", async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid };
            const result = await selectedCollection.find(query).toArray();
            res.json(result);
        });

        // delete data from cart delete api
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { model: (id) };
            const result = await selectedCollection.deleteOne(query);
            res.json(result);
        });


        // delete data from cart delete api
        app.delete("/prod/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await selectedCollection.deleteOne(query);
            res.json(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Assignments 12!')
})

app.listen(port, () => {
    console.log(`Server Running at ${port}`)
})