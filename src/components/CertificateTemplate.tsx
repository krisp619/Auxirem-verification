import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificateTemplate = ({ data }: any) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    const element = certificateRef.current;

    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${data.candidateName}-certificate.pdf`);
  };

  return (
    <div className="flex flex-col items-center">

      {/* CERTIFICATE */}
      <div
        ref={certificateRef}
        className="w-full max-w-5xl bg-white p-10 rounded-xl shadow-lg text-center border"
      >

        <h1 className="text-3xl font-bold mb-4">
          CERTIFICATE OF COMPLETION
        </h1>

        <p className="text-gray-500 mb-2">
          This is proudly presented to
        </p>

        <h2 className="text-4xl font-bold text-blue-600 mb-4">
          {data.candidateName}
        </h2>

        <p className="text-gray-500 mb-4">
          for successfully completing
        </p>

        <h3 className="text-2xl font-semibold text-purple-600 mb-6">
          {data.course}
        </h3>

        <div className="flex justify-between mt-10 text-sm">
          <div>
            <p className="text-gray-500">Issue Date</p>
            <p className="font-medium">{data.issueDate}</p>
          </div>

          <div>
            <p className="text-gray-500">Certificate ID</p>
            <p className="font-medium">{data.certificateNumber}</p>
          </div>
        </div>

      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
      >
        Download Certificate
      </button>

    </div>
  );
};

export default CertificateTemplate;