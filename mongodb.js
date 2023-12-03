// CRUD create read update delete

const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database!");
    }
    const db = client.db(databaseName);
    console.log("connected to database!", db);

    //CREATE
    // db.collection("users")
    //   .insertOne({
    //     name: "Andrew",
    //     age: 27,
    //   })
    //   .then((result) => console.log("data inserted====>", result))
    //   .catch((error) => console.log("error while inserting", error));

    // db.collection("tasks").insertMany(
    //   [
    //     { description: "eating food", completed: false },
    //     { description: "doing yoga", completed: true },
    //     { description: "reading book", completed: false },
    //   ],
    //   (error, response) => {
    //     if (error) {
    //       console.log("error while inserting many documents");
    //     }
    //     console.log("documents inserted", response);
    //   }
    // );

    // READ
    // db.collection("tasks").findOne(
    //   { _id: new ObjectId("654100d2f73c0f291e5c81c4") },
    //   (error, response) => {
    //     if (error) {
    //       console.log("error while finding data", error);
    //     }
    //     console.log("find by id====>", response);
    //   }
    // );

    // db.collection("tasks")
    //   .find({ completed: false })
    //   .toArray((error, response) => {
    //     if (error) {
    //       console.log("error while finding data", error);
    //     }
    //     console.log("find by many====>", response);
    //   });

    //UPDATE
    // const updatedDescription = db.collection("tasks").updateOne(
    //   {
    //     _id: new ObjectId("654100d2f73c0f291e5c81c4"),
    //   },
    //   {
    //     $set: {
    //       description: "cook food",
    //     },
    //   }
    // );
    // updatedDescription
    //   .then((response) => {
    //     console.log("updated successfully", response);
    //   })
    //   .catch((error) => {
    //     console.log("error while updating", error);
    //   });

    //UPDATE MANY
    const updatedCompleted = db.collection("tasks").updateMany(
      {
        completed: false,
      },
      {
        $set: {
          completed: true,
        },
      }
    );
    updatedCompleted
      .then((response) => {
        console.log("updated successfully", response);
      })
      .catch((error) => {
        console.log("error while updating", error);
      });
  }
);
