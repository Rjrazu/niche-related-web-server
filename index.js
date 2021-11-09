const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nklmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


async function run() {
    try {
        await client.connect();
        console.log('Connected Mongo Successfully');
        // const database = client.db('doctors_portal');
        // const appointmentsCollection = database.collection('appointments');

        // app.get('/appointments', async (req, res) => {
        //     const email = req.query.email;
        //     const date = new Date(req.query.date).toLocaleDateString();

        //     const query = { email: email, date: date }

        //     const cursor = appointmentsCollection.find(query);
        //     const appointments = await cursor.toArray();
        //     res.json(appointments);
        // })

        // app.post('/appointments', async (req, res) => {
        //     const appointment = req.body;
        //     const result = await appointmentsCollection.insertOne(appointment);
        //     console.log(result);
        //     res.json(result)
        // });

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