// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
const {MongoClient, ObjectID} =  require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
console.log(id, id.getTimestamp());

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client)=>{
    if(error) {
        console.error("Connection failed", error);
        return;
    }
    console.log("Connected to MongoDB");
    const db = client.db(databaseName);
    db.collection('users').insertOne({
        name: 'Dinesh',
        age: 33,
        _id : id
    }, (error, result) => {
        console.log(error, result);
    });

    // db.collection('users').insertMany([
    //     {name: 'Sneha', age: 32},
    //     {name: 'Shrusti', age: 28}
    // ], (error, result) => {
    //     if(error) {
    //         console.log("Error");
    //     } else {
    //         console.log("Result", result.ops);
    //     }
    // });

    // db.collection('tasks').insertMany([
    //     {description: 'Clean the house', completed: true},
    //     {description: 'Renew inspection', completed: false},
    //     {description: 'Pot plants', completed: false},
    // ], (error, result) => {
    //     if(error) {
    //         console.log('Error Occured');
    //         return;
    //     }
    //     console.log(result.ops);
    // })
});
