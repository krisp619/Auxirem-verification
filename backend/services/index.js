const model = require("../models")

async function verifyCertificate(certificateId){

const certificate = model.findCertificateById(certificateId)

return certificate

}

module.exports = {
verifyCertificate
}