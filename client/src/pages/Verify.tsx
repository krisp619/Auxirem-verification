import React, { useState, useRef, useEffect } from "react";
import { CheckSquare, QrCode, CheckCircle, Eye, Download } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const Verify = () => {

  const [activeTab, setActiveTab] = useState("form");
  const navigate = useNavigate();
  const [certificateType, setCertificateType] = useState("Bootcamp Certificate");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [course, setCourse] = useState("Full Stack Development");
  const [issueDate, setIssueDate] = useState("");
  const [qrResult, setQrResult] = useState("");
  const verifiedRef = useRef<HTMLDivElement | null>(null);

  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (activeTab === "qr") {

      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText) => {
          setQrResult(decodedText);
          console.log("QR Result:", decodedText);
        },
        (error) => {
          console.warn(error);
        }
      );

      return () => {
        scanner.clear().catch(() => { });
      };
    }
  }, [activeTab]);

  // ✅ CHANGE: validation function
  const validateForm = () => {

    // empty fields check
    if (
      certificateNumber.trim() === "" ||
      candidateName.trim() === "" ||
      issueDate.trim() === ""
    ) {
      alert("All fields required. Please fill all fields.");
      return false;
    }

    // certificate number format validation
    const certPattern = /^AUX-[A-Z]{2}-[A-Z]{3}-\d{4}-\d{4}$/;

    if (!certPattern.test(certificateNumber)) {
      alert("Please fill correct information. Certificate number format is invalid.");
      return false;
    }

    return true;
  };

  const handleDownloadCertificate = async () => {
    if (!verifiedRef.current) return;

    const canvas = await html2canvas(verifiedRef.current, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // ✅ FIXED NAME
    pdf.save("certificate.pdf");
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ CHANGE: validation check before verify
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    console.log({
      certificateType,
      certificateNumber,
      candidateName,
      course,
      issueDate
    });

    setVerified(true);

    // ✅ CHANGE: scroll after verification
    setTimeout(() => {
      verifiedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  };

  return (
    <div className="w-full bg-gray-50">

      {/* HERO */}
      <div
        className="w-full h-[380px] flex items-center justify-center text-white relative"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/07/08/04/12/work-5382501_640.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative text-center">
          <h1 className="text-5xl font-bold mb-4">
            Certificate Verification
          </h1>

          <p className="text-lg opacity-90">
            Verify the authenticity of certificates issued by Auxirem.
          </p>
        </div>
      </div>

      <section className="w-full bg-gray-50 py-16">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              How Certificate Verification Works
            </h2>

            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Easily verify the authenticity of Auxirem certificates using a
              unique certificate ID or QR code.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <div className="group bg-white rounded-xl shadow-lg p-8 text-center">

              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold mb-4 transition-transform duration-300 group-hover:scale-110">
                1
              </div>

              <h3 className="font-semibold text-lg mb-2">
                Enter Certificate ID
              </h3>

              <p className="text-gray-500 text-sm">
                Enter the unique certificate ID mentioned on the certificate.
              </p>

            </div>

            {/* Step 2 */}
            <div className="group bg-white rounded-xl shadow-lg p-8 text-center">

              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold mb-4 transition-transform duration-300 group-hover:scale-110">
                2
              </div>

              <h3 className="font-semibold text-lg mb-2">
                Scan QR Code
              </h3>

              <p className="text-gray-500 text-sm">
                Alternatively, scan the QR code printed on the certificate.
              </p>

            </div>

            {/* Step 3 */}
            <div className="group bg-white rounded-xl shadow-lg p-8 text-center">

              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold mb-4 transition-transform duration-300 group-hover:scale-110">
                3
              </div>

              <h3 className="font-semibold text-lg mb-2">
                Get Instant Result
              </h3>

              <p className="text-gray-500 text-sm">
                Our system validates the certificate and shows the official details.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* FORM AREA */}
      <section className="w-full bg-white py-24">

        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-white rounded-2xl shadow-xl p-10">

            <h2 className="text-2xl font-semibold text-center mb-6">
              Verify Certificate
            </h2>

            {/* TABS */}
            <div className="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden mb-6">

              {/* FORM TAB */}
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center justify-center gap-2 w-full sm:flex-1 py-3 px-4 text-sm sm:text-base font-medium transition 
    ${activeTab === "form"
                    ? "bg-blue-50 text-blue-600 border-b-2 sm:border-b-0 sm:border-r border-blue-600"
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <CheckSquare size={18} />
                Enter Certificate ID
              </button>

              {/* QR TAB */}
              <button
                onClick={() => setActiveTab("qr")}
                className={`flex items-center justify-center gap-2 w-full sm:flex-1 py-3 px-4 text-sm sm:text-base font-medium transition 
    ${activeTab === "qr"
                    ? "bg-blue-50 text-blue-600 border-b-2 sm:border-b-0 sm:border-l border-blue-600"
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <QrCode size={18} />
                Scan QR Code
              </button>

            </div>

            {/* FORM */}
            {activeTab === "form" && (
              <form onSubmit={handleVerify} className="space-y-6">

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Certificate Type
                  </label>

                  <select
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Bootcamp Certificate</option>
                    <option>Workshop Certificate</option>
                    <option>Internship Certificate</option>
                    <option>Course Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Certificate Number
                  </label>

                  <input
                    type="text"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="Example: AUX-BC-FSD-2025-2215"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Candidate Name
                  </label>

                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter candidate full name"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Course / Program
                    </label>

                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Full Stack Development</option>
                      <option>React Development</option>
                      <option>UI UX Design</option>
                      <option>Data Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Issue Date
                    </label>

                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 text-white text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:opacity-95"
                >
                  Verify Certificate →
                </button>

              </form>
            )}

            {/* QR TAB */}
            {activeTab === "qr" && (

              <div className="text-center py-10">

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-10">

                  <p className="text-gray-700 mb-4 text-lg font-medium">
                    QR Code Scanner
                  </p>

                  {/* Camera Scanner */}
                  <div
                    id="reader"
                    className="w-full max-w-md mx-auto"
                  ></div>

                  {qrResult && (
                    <div className="mt-4 text-green-600 font-medium text-sm">
                      Scanned Result: {qrResult}
                    </div>
                  )}

                </div>

              </div>

            )}
          </div>

        </div>

      </section>


      {/* verified card */}
      {/* VERIFIED CARD */}

      {verified && (

        <div className="w-full py-16 px-4 bg-gray-50">

          <div
            ref={verifiedRef}
            className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8"
          >

            {/* HEADER */}
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="text-green-500 mr-2" size={26} />
              <h2 className="text-xl sm:text-2xl font-semibold">
                Certificate Verified
              </h2>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-gray-500">Certificate Name</label>
                <input value={candidateName} readOnly className="form-input w-full mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Certificate Number</label>
                <input value={certificateNumber} readOnly className="form-input w-full mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Certificate Type</label>
                <input value={certificateType} readOnly className="form-input w-full mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Program</label>
                <input value={course} readOnly className="form-input w-full mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Issue Date</label>
                <input value={issueDate} readOnly className="form-input w-full mt-1" />
              </div>

              <div className="flex items-end">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium">
                  VERIFIED
                </span>
              </div>

            </div>

            {/* BUTTONS */}
       <div className="flex flex-col sm:flex-row gap-4 mt-8">

  {/* VIEW BUTTON */}
  <button
    onClick={() => navigate(`/certificate/${certificateNumber}`)}
    className="flex items-center justify-center gap-2 w-full py-3 text-white font-semibold rounded-lg 
    bg-gradient-to-r from-blue-600 to-purple-600 
    shadow-md hover:opacity-95 transition"
  >
    <Eye size={18} />
    View Certificate
  </button>

  {/* DOWNLOAD BUTTON */}
  <button
    onClick={handleDownloadCertificate}
    className="flex items-center justify-center gap-2 w-full py-3 text-white font-semibold rounded-lg 
    bg-gradient-to-r from-blue-600 to-purple-600 
    shadow-md hover:opacity-95 transition"
  >
    <Download size={18} />
    Download Certificate
  </button>

</div>

          </div>

        </div>

      )}
    </div>
  );
};

export default Verify;