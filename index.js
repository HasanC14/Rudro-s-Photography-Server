const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
//var jwt = require("jsonwebtoken");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@back-prac-2-admin.sldkkq5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// const verifyJWT = (req, res, next) => {
//   const AuthHeader = req.headers.authorization;
//   if (!AuthHeader) {
//     return res.status(401).send({ Message: "Unauthorized Access" });
//   }
//   const token = AuthHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(401).send({ Message: "Unauthorized Access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// };
async function run() {
  try {
    const ServiceCollection = client.db("RP_Database").collection("Services");
    const ReviewCollection = client.db("RP_Database").collection("Reviews");
    //All Services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = ServiceCollection.find(query).sort({
        _id: -1,
      });
      const services = await cursor.toArray();
      res.send(services);
    });
    //Limit Service
    app.get("/LimitServices", async (req, res) => {
      const query = {};
      const cursor = ServiceCollection.find(query)
        .sort({
          _id: -1,
        })
        .limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    //Getting a Single Service by ID
    app.get("/Services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ServiceCollection.findOne(query);
      res.send(result);
    });
    //Add Service
    app.post("/AddService", async (req, res) => {
      const service = req.body;
      const result = await ServiceCollection.insertOne(service);
      res.send(result);
    });
    //Add Review
    app.post("/AddReview", async (req, res) => {
      const Review = req.body;
      const result = await ReviewCollection.insertOne(Review);
      res.send(result);
    });
    //Service ID dia filtered Review
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.id) {
        query = { ServiceID: req.query.id };
      }
      const cursor = ReviewCollection.find(query).sort({
        Time: -1,
      });
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //All Reviews
    // app.get("/reviews", async (req, res) => {
    //   const query = {};
    //   const cursor = ReviewCollection.find(query);
    //   const reviews = await cursor.toArray();
    //   res.send(reviews);
    // });
    //JWT
    // app.post("/jwt", (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "1h",
    //   });
    //   res.send({ token });
    //   //send must json e hote hobe tai second bracket die dilam
    // });

    //All service with limit
    // app.get("/services", async (req, res) => {
    //     const CurrentPage = parseInt(req.query.CurrentPage);
    //     const PerPageData = parseInt(req.query.PerPageData);

    //     const query = {};
    //     const cursor = ServiceCollection.find(query);
    //     const services = await cursor
    //       .skip(CurrentPage * PerPageData)
    //       .limit(PerPageData)
    //       .toArray();

    //     const count = await ServiceCollection.estimatedDocumentCount();

    //     res.send({ count, services });
    //   });

    //Update Status
    // app.patch("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const status = req.body.status;
    //   console.log(status);
    //   const filter = { _id: ObjectId(id) };
    //   const UpdatedDoc = {
    //     $set: {
    //       status: status,
    //     },
    //   };
    //   const result = await OrderCollection.updateOne(filter, UpdatedDoc);
    //   res.send(result);
    // });

    //Delete User
    // app.delete("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) }; //eta thik thak na hoile pura database e jabe ga
    //   console.log("trying to delete", id);
    //   const result = await OrderCollection.deleteOne(query);
    //   res.send(result);
    // });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
