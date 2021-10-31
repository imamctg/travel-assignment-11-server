const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ded9r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelling');
        const serviceCollection = database.collection('services');
        const hotelCollection = database.collection('hotels');
        const bookingCollection = database.collection('bookings');

        // GET PRODUCTS API 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET PRODUCTS API 
        app.get('/hotels', async (req, res) => {
            const cursor = hotelCollection.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
        })

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })
        // GET SINGLE SERVICE
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const bookings = await bookingCollection.findOne(query);
            res.json(bookings);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)
            console.log('Post Hitted')
            const result = await serviceCollection.insertOne(service);
            console.log(result)
            res.send(result)
        })

        // ADD BOOKING API
        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await bookingCollection.insertOne(bookings);
            res.json(result);
        })



        // GET BOOKING

        app.get('/bookings', async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);

        });

        // UPDATE API
        app.put('/bookings/:id', async (req, res) => {
            console.log(req)
            const id = req.params.id;
            const orderStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const bookings = {
                $set: {
                    status: orderStatus.status
                }
            }

            const result = await bookingCollection.updateOne(filter, bookings, options)
            res.json(result)
            console.log('Updating User', req);
            res.json('Updating not dating')


        })

        // DELETE API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            console.log('checking', id);
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })



        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('assignment server is running');
})

app.listen(port, () => {
    console.log('Server Running at port', port);
})