const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const { findAllRecipes, findRecipeById, findRecipeByUser, createRecipe, editRecipe, deleteRecipe } = require('../controllers/recipeController')

router.route('/').get(findAllRecipes).post(protect, createRecipe)
router.route('/:id').get(findRecipeById).put(protect, editRecipe).delete(protect, deleteRecipe)
router.route('/user/:id').get(findRecipeByUser)

module.exports = router