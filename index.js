const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;
// Dotenv
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json());

console.log(process.env.USER_PASS);

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.vjc6ohr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db('bhramanDb').collection('users');

    // user related API
    app.get('/users', async(req, res)=> {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req, res)=> {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
        console.log(user);
    })

    // Make Admin API
    app.patch('/users/admin/:id', async (req, res) => {
      const filter = {_id: new ObjectId(req.params.id)}
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // Make Tour Guide API
    app.patch('/users/tour-guide/:id', async (req, res)=> {
      const filter = {_id: new ObjectId(req.params.id)}
      const updateDoc = {
        $set: {
          role: 'tour guide'
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=> {
    res.send('Bhraman Guide Server is running...');
})
app.listen(port, ()=> {
    console.log(`Bhraman Guide app listening on port ${port}`);
})