const usersDB = {
    users : require('../model/users.json'),
    setUsers : function(data){ this.users = data }
}
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")
const fsPromises = require("fs").promises;
const path = require("path")

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    if(!user || !pwd) res.status(400).json({ "message" : "Username and password are required"})
    const foundUser =  usersDB.users.find(person => person.username === user) 
    if(!foundUser) return res.status(401).json({"message" : "User is not found"}); //Unauthorized
    // 
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match){
        //create JWT
        const accesToken = jwt.sign(
            {"username" : foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : '30s'}
        );
        const refreshToken = jwt.sign(
            {"username" : foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn : '1d'}
        ); 
        res.json({ 'success' : `User ${user} is logged in`})
    }else {
        res.sendStatus(401)
    }
}

module.exports = {handleLogin}