const express = require("express")
const usersRouter = express.Router()
const { createUser } = require("../db")

usersRouter.post("/register", async (req, res, next) => {
    const {username, password} = req.body
    console.log(username)
    try {
        const user = await createUser({username, password})
        res.user = user
        console.log("inside try")
        console.log(user, "USER")
        res.send({message: "Thanks for registering!"})
        
    } catch (error) {
        console.error(error)
    }
})


module.exports = usersRouter