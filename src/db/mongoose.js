const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGODB_SERVER}/${process.env.MONDODB_NAME}`, 
                { 
                    useNewUrlParser: true, 
                    useCreateIndex: true 
                }
                );
