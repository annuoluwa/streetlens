const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');


const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        //check if user already exists

        const existingUser = await findUserByEmail(email);
        if(existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        //hash password

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //create user

        const newUser =await createUser(username, email, hashedPassword);

        //create JWT token

        const token = jwt.sign({id: newUser.id }, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.status(201).json({user: newUser, token});
    }catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //find user

        const user = await findUserByEmail(email);
        if(!user) return res.status(400).json({message: "Invalid credentials"});

        //compare password

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        //create JWT token

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({user: {id: user.id, username: user.username, email: user.email}, token});

    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }

}


    module.exports ={
    register,
    login,
    };