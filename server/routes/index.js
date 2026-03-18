const express = require("express")

const router = express.Router()

const controller = require("../controllers")

// verify certificate
router.post("/verify", controller.verifyCertificate)

// health check
router.get("/health",(req,res)=>{
res.json({
status:"server running"
})
})

module.exports = router
