const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(req, res){
    const {username, email, password, role="user"} = req.body;

    try{
        const isUserAlreadyExisting = await userModel.findOne({
            $or: [
                {username}, 
                {email}
            ]
        })

        if(isUserAlreadyExisting){
            return res.status(409).json({
                message: "User already exists!"
            })
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username, 
            email,
            password: hash,
            role
        })

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.cookie('token', token);

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch(error){
        console.log("There is a problem during your Login: ", error);
    }
}

