const mongoose = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema({
    description: {
        type: "String",
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});
schema.pre("save",  async function(){
    console.log("saving", this);
})

const Task = mongoose.model('Task', schema);

module.exports = Task;