const express = require("express")
const cors = require("cors")

const routes = require("./routes")

const app = express()

app.use(cors())
app.use(express.json())

// Root route
app.get("/", (req,res)=>{
res.json({
message:"Certificate Verification API Running"
})
})

app.use("/api/certificates", routes)

module.exports = app
