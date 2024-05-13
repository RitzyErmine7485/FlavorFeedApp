const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require("../models/userModel")

const register = asyncHandler( async (req, res) => {
    const { name, email, password, recipes } = req.body

    if (!name || !email || !password) {
        res.status(400).json({ error: 'Bad Request: Data incomplete' })
        return
    }

    let userData = {
        name,
        email,
        password: await bcrypt.hash(password, 10)
    }

    try {
        let user = await User.findOneAndUpdate(
            { email },
            { $setOnInsert: userData },
            { upsert: true, new: true }
        )

        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: 'Bad Request: Missing email or password' })
        return
    }

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: genToken(user.id)
        })
    } else {
        res.status(401).json({ error: 'Invalid credentials' })
    }
})

const genToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const showdata = (req, res) => {
    res.status(200).json(req.user)
}

const updateUser = async (req, res) => {
    const { name, email, password } = req.body
    const userId = req.params.id

    try {
        let user = await User.findById(userId)

        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email: email })
            if (existingUser) {
                res.status(400).json({ error: 'Email already in use' })
                return
            }
            user.email = email
        }
        
        if (name) user.name = name
        if (password) user.password = await bcrypt.hash(password, 10)

        user = await user.save()

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id

    try {
        const user = await User.findById(userId)

        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        await User.findByIdAndDelete(userId)

        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
}

const getNameById = async (req, res) => {
    const userId = req.params.id

    try {
        const user = await User.findById(userId)
        
        if(!user) {
            res.status(404).json({ error: 'User not found' })
        }

        res.status(200).json( user )
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
}

module.exports = {
    register,
    login,
    showdata,
    updateUser,
    deleteUser,
    getNameById
}