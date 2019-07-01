const {MongoClient, ObjectID} = require('mongodb');

const dbUrl = 'mongodb://127.0.0.1:27017';
MongoClient.connect(dbUrl, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        console.log(`Could not connect to db ${dbUrl}`);
        return;
    }
    console.log(`Connection established`);
    const db = client.db('task-manager');
    
    // db.collection('users').findOne({_id: ObjectID('5cefdb9860bd048cadbf55e7')},(error, user)=>{
    //     console.log(user);
    // });

    db.collection('users').find({age: 33}).toArray((error, users) => {
        console.log(users);
    })

    client.close((error, result) => {
        if(!error)
            console.log(`Connection closed. ${result}`);
    });
    
})