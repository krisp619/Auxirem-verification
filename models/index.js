module.exports = {};
const certificates = [
{
certificateId: "AXR1001",
studentName: "Rahul Patil",
course: "Full Stack Internship",
date: "2026-03-01"
},
{
certificateId: "AXR1002",
studentName: "Sneha Sharma",
course: "Python Internship",
date: "2026-03-02"
}
]

function findCertificateById(id){
return certificates.find(cert => cert.certificateId === id)
}

module.exports = {
findCertificateById
}
