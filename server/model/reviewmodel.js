const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("Review",reviewSchema)