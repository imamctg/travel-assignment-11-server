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
        const database = client.db('carSeller');
        const productCollection = database.collection('products');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');
        const usersCollection = database.collection('users');

        // GET PRODUCTS API 
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })



        // GET SINGLE PRODUCT
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.json(product);
        })
        // GET SINGLE ORDER
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const orders = await orderCollection.findOne(query);
            res.json(orders);
        })

        // POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product)
            console.log('Post Hitted')
            const result = await productCollection.insertOne(product);
            console.log(result)
            res.send(result)
        })
        // POST API REVIEWS
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            console.log('hit the post api', reviews)
            console.log('Post Hitted')
            const result = await reviewCollection.insertOne(reviews);
            console.log(result)
            res.send(result)
        })

        // GET REVIEW API 
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // ADD ORDER API
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.json(result);
        })



        // GET ALL ORDER

        app.get('/orders', async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);

        });

        // UPDATE ORDER
        app.put('/order/:id', async (req, res) => {
            console.log(req)
            const id = req.params.id;
            const orderStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const orders = {
                $set: {
                    status: orderStatus.status
                }
            }

            const result = await orderCollection.updateOne(filter, orders, options)
            console.log(result);
            res.json(result)



        })

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('checking', id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })



        // DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
        })
        // Get Api
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



        // add user 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        // Update user 
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
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('assignment 12 server is running');
})

app.listen(port, () => {
    console.log('Server 12 Running at port', port);
})