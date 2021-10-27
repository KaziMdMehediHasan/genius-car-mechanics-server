const express = require('express');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// name : car
// pass: XcRuxJVg56KtbO6w;

// connecting the database

const uri = `mongodb+srv://car:XcRuxJVg56KtbO6w@cluster0.tzgvu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//   console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connecting the app to the database
async function run() {
  try {
    await client.connect();
    console.log("connected to database");

    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    //get API

    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get single service

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    //post api

    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post", service);
      // res.send("post got hit");

      // const service = {
      //   "name": "ENGINE DIAGNOSTIC",
      //   "price": "300",
      //   "description":
      //     "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
      //   "img": "https://i.ibb.co/dGDkr4v/1.jpg",
      // };

      const result = await servicesCollection.insertOne(service);

      console.log(result);
      res.json(result);
    });

    //DELETE API

    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//end of database connection

app.get("/", (req, res) => {
  res.send("Genius Server is running!");
});

app.get("/hello", (req, res) => {
  res.send("Hello updated here")
})

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port", port);
});


/*
onetime : 
1. Heroku Account Creation
2. Heroku software install

every project :

1. git init 
2. .gitignore (node_modules, .env)
3. push everything to git
4. make sure you have this script : "start" : "node index.js"
5. make sure : put process.env.PORT in front of your port number
6. heroku login
7. heroku create (one time for a project)
8. command : git push heroku main
9. heroku > app > settings > add Var (add DB_User)
-----------

update 
1. git add , git commit -m , git push
2. git push heroku main
*/