import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import certificateImg from "../assets/certificate-bg.png";

const CertificateView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/certificate/${id}`)
      .then((res) => res.json())
      .then((data) => setCertificate(data))
      .catch(() => {
        setCertificate({
          candidateName: "Sayali",
          certificateId: id,
          certificateUrl: certificateImg
        });
      });
  }, [id]);

  // ✅ DOWNLOAD PDF (FIXED)
  const handleDownload = async () => {
    const element = document.getElementById("certificate");

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save("certificate.pdf");
  };

  if (!certificate) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* BACK BUTTON */}
      <div className="w-full max-w-6xl px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* CERTIFICATE CONTAINER */}
      <div className="w-full max-w-6xl px-4 mt-6 flex justify-center">

        <div
          id="certificate"
          className="bg-white p-3 sm:p-4 rounded-xl shadow-2xl w-full"
        >
          <img
            src={certificate.certificateUrl || certificateImg}
            alt="Certificate"
            className="w-full rounded-lg object-contain"
          />
        </div>

      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="flex justify-center mt-6 mb-10">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition"
        >
          <Download size={18} />
          Download Certificate
        </button>
      </div>

    </div>
  );
};

export default CertificateView;