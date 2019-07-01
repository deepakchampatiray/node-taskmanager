const {MongoClient, ObjectID} = require('mongodb');

const dbUrl = 'mongodb://127.0.0.1:27017';
MongoClient.connect(dbUrl, {useNewUrlParser: true})
    .then((client)=>{
        console.log('Connected');
        const db = client.db('task-manager');
        db.collection('users')
            .updateOne(
                {_id: new ObjectID('5cefceb51c0b9d8aed07a110')},
                {
                    $set: {
                        name: 'Sanujeet'
                    }
                }
            )
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
        
        db.collection('tasks')
            .updateMany(
                {completed: false},
                {
                    $set: {
                        completed: true
                    }
                }
            ).then((result)=>{
                console.log(result.modifiedCount)
            }).catch((error)=>{
                console.log(error);
            });
            
        client.close();
    })
    .catch((error)=>{
        console.log('Error while connecting', error);
    })