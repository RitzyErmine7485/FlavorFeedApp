const { Schema, model, Types } = require("mongoose")

const recipeSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{
        type: String
    }],
    steps: [{
        type: String
    }],
    categories: [{
        type: String
    }],
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = model('Recipe', recipeSchema)