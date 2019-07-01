const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

var schema = new mongoose.Schema({
    name: {
        type: "String",
        required: true
    },
    age: {
        type: Number,
        default: 0,
        min: 0,
        max: 120
    },
    email: {
        type: "String",
        unique: true,
        required: true,
        validate(val) {
            if (!validator.isEmail(val))
                throw new Error('Invalid Email Address');
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 250,
        validate(val) {
            if (validator.contains(val.toLowerCase(), 'password'))
                throw new Error('Password can not contain the word "password"');
        }
    },
    avatar: {
        type: Buffer,
        required: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

schema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

schema.pre('save', async function (next) {
    //console.log('Just before Saving', this);
    if(this.isModified('password')) {
        //console.log('Password Modified');
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Delete tasks before deleting user
schema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
});

schema.methods.getAuthenticationToken = async function(){
    const token = jwt.sign({_id: this.id.toString()}, process.env.JWT_SECRET);
    this.tokens.push({token: token});
    await this.save();
    return token;
};
schema.methods.toJSON = function() {
    let user = this.toObject();
    //console.log(user);
    delete user.password;
    delete user.tokens;
    delete user.avatar;
    delete user.__v;
    return user;
};

schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email: email
    });
    if(!user) {
        throw new Error('No user id found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)
        throw new Error('No user id password found');
    
    return user;
}

const User = mongoose.model('User', schema);

module.exports = User;