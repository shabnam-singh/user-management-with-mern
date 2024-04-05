const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required:true
    },
    phone: {
        type: String, 
        unique: true,
        required:true
    },
    password: {
       type: String,
        required: true
    },
    image: {
        type:String,
        required:true
    },
    is_verified:{
        type:Number,
        default:0,
        required:true
    }
}, { timestamps: false });

module.exports = mongoose.model('User', userSchema);
