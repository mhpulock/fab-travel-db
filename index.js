const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

// middlewaire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vljcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("fabTravel");
    const addTourCollection = database.collection("addTour");
    const bookingCollection = database.collection("mybooking");
    const adduserCollection = database.collection("adduser");

    //get api
    app.get("/addTour", async (req, res) => {
      const cursor = addTourCollection.find({});
      const result = await cursor.toArray();
      // console.log(result);
      res.send(result);
    });

    app.get("/mybooking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      // console.log(result);
      res.send(result);
    });

    // get single api
    app.get("/addTour/:id", async (req, res) => {
      const id = req.params.id;
      const queary = { _id: ObjectId(id) };
      const result = await addTourCollection.findOne(queary);
      res.json(result);
    });

    // post api
    app.post("/addTour", async (req, res) => {
      const tours = req.body;
      const result = await addTourCollection.insertOne(tours);
      res.json(result);
      console.log(result);

      console.log("hit the post api");
      res.send("post hitted");
    });

    app.post("/mybooking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.json(result);
      console.log(result);

      console.log("hit the post api");
      res.send("post hitted");
    });

    // update api
    app.put("/adduser", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updatedoc = { $set: user };
      const result = await adduserCollection.updateOne(
        filter,
        updatedoc,
        options
      );
      res.json(result);
      console.log(result);
    });

    // delete item
    app.delete("/dashboard/managetour/:id", async (req, res) => {
      const id = req.params.id;
      const queary = { _id: ObjectId(id) };
      const result = await addTourCollection.deleteOne(queary);
      res.json(result);
    });

    // delete item
    app.delete("/dashboard/mybooking/:id", async (req, res) => {
      const id = req.params.id;
      const queary = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(queary);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Fab Travel DB");
});

app.listen(port, () => {
  console.log("Test fab travel port", port);
});
