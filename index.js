const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;
// Dotenv
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.USER_PASS);

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.vjc6ohr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("bhramanDb").collection("users");
    const packagesCollection = client.db("bhramanDb").collection("packages");
    const bookingCollection = client.db("bhramanDb").collection("booking");
    const wishListCollection = client.db("bhramanDb").collection("wishList");

    // user related API
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log(user);
    });

    app.patch('/users', async(req, res)=> {
      const body = req.body;
      const filter = {email: req.body.email}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...body,
        }
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    // Make Admin API
    app.patch("/users/admin/:id", async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Make Tour Guide API
    app.patch("/users/tour-guide/:id", async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const updateDoc = {
        $set: {
          role: "tour guide",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.get("/users/tour-guide/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Packages API
    app.post("/packages", async (req, res) => {
      const package = req.body;
      const result = await packagesCollection.insertOne(package);
      res.send(result);
      console.log(package);
    });

    app.get("/packages", async (req, res) => {
      const result = await packagesCollection.find().toArray();
      res.send(result);
    });

    app.get("/packages/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await packagesCollection.findOne(query);
      res.send(result);
    });

    // Booking API
    app.get("/booking", async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result);
    });
    app.get("/booking/:email", async (req, res) => {
      const query = {tourist_email: req.params.email}
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
      console.log(query);
    });
    app.post("/booking", async (req, res) => {
      const book = req.body;
      const result = await bookingCollection.insertOne(book);
      res.send(result);
      console.log(book);
    });

    // Wishlist API
    app.get("/wishlist", async (req, res) => {
      const result = await wishListCollection.find().toArray();
      res.send(result);
    });

    app.post('/wishlist', async(req, res)=> {
      const book = req.body;
      const result = await wishListCollection.insertOne(book);
      res.send(result);
    })

    app.delete('/wishlist/:id', async(req, res)=> {
      const query = {_id: new ObjectId(req.params.id)}
      const result = await wishListCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bhraman Guide Server is running...");
});
app.listen(port, () => {
  console.log(`Bhraman Guide app listening on port ${port}`);
});
