// create the express server here
const PORT = 3000

const express = require("express")
const cors = require('cors')
const app = express()
const apiRouter = require("./api")

app.use(cors())

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})

