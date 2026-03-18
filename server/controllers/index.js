const service = require("../services")

async function verifyCertificate(req,res){

try{

const {certificateId} = req.body

if(!certificateId){
return res.status(400).json({
message:"Certificate ID required"
})
}

const certificate = await service.verifyCertificate(certificateId)

if(!certificate){

return res.status(404).json({
status:"invalid",
message:"Invalid Certificate"
})

}

return res.json({
status:"valid",
certificate
})

}catch(error){

return res.status(500).json({
message:"Server Error"
})

}

}

module.exports = {
verifyCertificate
}