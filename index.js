const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ryx6w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travelDelight");
    const toursCollection = database.collection("tours");
    const bookingCollection = database.collection('booking');
    //Get API
    app.get('/tours', async (req, res) => {
      const cursor = toursCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours)
    })
    //Get Unique API
    app.get('/tours/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await toursCollection.findOne(query);
      res.json(tour);
    })

    //Get Booking API
    app.get('/bookings', async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings)
    })

    //Post API
    app.post("/tours", async (req, res) => {
      const tour = req.body;
     console.log('hitting post api', tour );
      const result = await toursCollection.insertOne(tour);
      console.log(result);
      res.json(result)
    });

    //Delete Unique API
    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });

    //Booking API
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      const result=await bookingCollection.insertOne(booking)
      res.json(result);
    })

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("travel delight running");
});
app.listen(port, () => {
  console.log("travel delight running on port", port);
});
