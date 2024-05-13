const asyncHandler = require('express-async-handler')
const Recipe = require('../models/recipeModel')

const findAllRecipes = asyncHandler(async (req, res) => {
    try {
        const searchQuery = req.query.search ? {
            title: {
                $regex: req.query.search,
                $options: 'i'
            }
        } : {};
    
        const recipes = await Recipe.find({ ...searchQuery });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

const findRecipeById = asyncHandler(async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json(recipe)
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

const findRecipeByUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id

        const recipes = await Recipe.find({ author: userId })

        if (!recipes) {
            res.status(404).json({ error: 'No recipes found for this user' })
            return
        }

        res.status(200).json({ recipes })
    } catch (error) {
        res.status(404).json({ error: 'Error: User not found' })
    }
})

const createRecipe = asyncHandler(async (req, res) => {
    try {
        const { title, description, ingredients, steps, categories } = req.body
        const userId = req.user.id

        if (!title || !description || !ingredients || !steps || !categories) {
            return res.status(400).json({ error: 'Data incomplete' });
        }

        const ingredientsArray = ingredients.split('\n').map(ingredient => ingredient.trim())
        const stepsArray = steps.split('\n').map(step => step.trim())
        const categoriesArray = categories.split(', ').map(category => category.trim())

        const newRecipe = await Recipe.create({
            title,
            description,
            ingredients: ingredientsArray,
            steps: stepsArray,
            categories: categoriesArray,
            author: userId
        })

        res.status(201).json({ message: 'Recipe created successfully', newRecipe })
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})


const editRecipe = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id
        const recipeId = req.params.id
        const { title, description, ingredients, steps, categories } = req.body

        let recipe = await Recipe.findOne({ _id: recipeId, author: userId })

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' })
        }

        recipe.title = title
        recipe.description = description
        recipe.ingredients = ingredients
        recipe.steps = steps
        recipe.categories = categories

        await recipe.save()

        res.status(200).json({ message: 'Recipe updated successfully', recipe })
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

const deleteRecipe = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id
        const recipeId = req.params.id

        const recipe = await Recipe.findOne({ _id: recipeId, author: userId })

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' })
        }

        await Recipe.deleteOne({ _id: req.params.id})

        res.status(200).json({ message: 'Recipe deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

module.exports = {
    findAllRecipes,
    findRecipeById,
    findRecipeByUser,
    createRecipe,
    editRecipe,
    deleteRecipe
}