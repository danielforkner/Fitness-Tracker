// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express")
const apiRouter = express.Router()
const usersRouter = require("./users")

apiRouter.get("/health", (req, res, next) => {
    res.send ({message: "Server is listening..."})
})

apiRouter.use('/users', usersRouter)


module.exports = apiRouter