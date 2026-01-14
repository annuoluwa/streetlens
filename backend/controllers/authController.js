const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById, updateUserPassword } = require('../models/userModel');


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
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }, token });
    }catch(err) {
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

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });

    } catch(err) {

        res.status(500).json({message: 'Server error'});
    }

}

const resetPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old and new password required.' });
        }
        // Find user
        const user = await findUserById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        // Get full user (with password_hash)
        const fullUser = await findUserByEmail(user.email);
        const isMatch = await bcrypt.compare(oldPassword, fullUser.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect.' });
        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        // Update password in DB
        await updateUserPassword(userId, hashedPassword);
        res.json({ message: 'Password updated successfully.' });
    } catch (err) {

        res.status(500).json({ message: 'Server error' });
    }
};


    module.exports ={
    register,
    login,
    resetPassword
    };