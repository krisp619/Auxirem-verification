import React, { useEffect, useRef, useState } from "react";
import { CheckSquare, QrCode, CheckCircle, Eye, Download } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

type CertificateRecord = {
  certificateId: string;
  studentName: string;
  course: string;
  date: string;
};

type VerifyApiResponse = {
  status?: "valid" | "invalid";
  message?: string;
  certificate?: CertificateRecord;
};

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

const Verify = () => {
  const navigate = useNavigate();
  const verifiedRef = useRef<HTMLDivElement | null>(null);
  const certificateCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeTab, setActiveTab] = useState("form");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [qrResult, setQrResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusTone, setStatusTone] = useState<"success" | "error" | "idle">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);

  const extractCertificateId = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "";

    const certMatch = trimmed.match(/(AUX-[A-Z]{2}-[A-Z]{3}-\d{4}-\d{4}|AXR\d{4})/i);
    if (certMatch?.[1]) {
      return certMatch[1].toUpperCase();
    }

    try {
      const parsed = new URL(trimmed);
      const searchId =
        parsed.searchParams.get("certificateId") || parsed.searchParams.get("id");

      if (searchId) {
        return searchId.trim().toUpperCase();
      }

      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        return segments[segments.length - 1].trim().toUpperCase();
      }
    } catch {
      return trimmed.toUpperCase();
    }

    return trimmed.toUpperCase();
  };

  const isValidCertificateInput = (value: string) => {
    const normalized = value.trim().toUpperCase();
    const auxPattern = /^AUX-[A-Z]{2}-[A-Z]{3}-\d{4}-\d{4}$/;
    const axrPattern = /^AXR\d{4}$/;
    return auxPattern.test(normalized) || axrPattern.test(normalized);
  };

  const runVerification = async (rawCertificateId: string) => {
    const normalizedId = extractCertificateId(rawCertificateId);

    if (!normalizedId) {
      setStatusTone("error");
      setStatusMessage("Certificate number is required.");
      setCertificate(null);
      return false;
    }

    if (!isValidCertificateInput(normalizedId)) {
      setStatusTone("error");
      setStatusMessage("Please enter a valid certificate number format.");
      setCertificate(null);
      return false;
    }

    setIsLoading(true);
    setCertificateNumber(normalizedId);
    setStatusMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/certificates/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ certificateId: normalizedId })
      });

      const data = (await response.json().catch(() => ({}))) as VerifyApiResponse;

      if (!response.ok || data.status !== "valid" || !data.certificate) {
        setCertificate(null);
        setStatusTone("error");
        setStatusMessage("Invalid Certificate");
        return false;
      }

      setCertificate(data.certificate);
      setStatusTone("success");
      setStatusMessage(data.message || "Valid Certificate");

      setTimeout(() => {
        verifiedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 100);

      return true;
    } catch {
      setCertificate(null);
      setStatusTone("error");
      setStatusMessage("Unable to verify right now. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "qr") return;

    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        const parsedCertificateId = extractCertificateId(decodedText);
        setQrResult(decodedText);

        if (parsedCertificateId) {
          void runVerification(parsedCertificateId);
        }
      },
      () => {
        // Intentionally keep scanner error silent to avoid noisy UI while camera is active.
      }
    );

    return () => {
      scanner.clear().catch(() => {
        // Ignore cleanup errors from the scanner teardown.
      });
    };
  }, [activeTab]);

  useEffect(() => {
    if (!certificate || !certificateCanvasRef.current) return;

    const canvas = certificateCanvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 850;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#f8fbff");
    gradient.addColorStop(1, "#e5f0ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 58px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", canvas.width / 2, 170);

    ctx.font = "28px Arial";
    ctx.fillStyle = "#334155";
    ctx.fillText("This certifies that", canvas.width / 2, 245);

    ctx.font = "bold 54px Georgia";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(certificate.studentName, canvas.width / 2, 330);

    ctx.font = "28px Arial";
    ctx.fillStyle = "#334155";
    ctx.fillText("has successfully completed", canvas.width / 2, 395);

    ctx.font = "bold 42px Arial";
    ctx.fillStyle = "#1d4ed8";
    ctx.fillText(certificate.course, canvas.width / 2, 460);

    ctx.font = "24px Arial";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "left";
    ctx.fillText(`Certificate ID: ${certificate.certificateId}`, 90, 700);
    ctx.fillText(`Issue Date: ${certificate.date}`, 90, 740);

    ctx.textAlign = "right";
    ctx.fillText("Auxirem", canvas.width - 90, 740);
  }, [certificate]);

  const handleDownloadCertificate = () => {
    const canvas = certificateCanvasRef.current;
    if (!canvas || !certificate) return;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${certificate.certificateId}.pdf`);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await runVerification(certificateNumber);
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3 text-white text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:opacity-95"
                >
                  {isLoading ? "Validating..." : "Validate"}
                </button>

                {statusMessage && (
                  <div
                    className={`rounded-md px-4 py-3 text-sm font-medium ${
                      statusTone === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}

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

                  {statusMessage && (
                    <div
                      className={`mt-4 rounded-md px-4 py-3 text-sm font-medium ${
                        statusTone === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {statusMessage}
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

      {certificate && (

        <div className="w-full py-16 px-4 bg-gray-50">

          <div
            ref={verifiedRef}
            className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8"
          >

            {/* HEADER */}
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="text-green-500 mr-2" size={26} />
              <h2 className="text-xl sm:text-2xl font-semibold">
                Valid Certificate
              </h2>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-gray-500">Certificate Name</label>
                <input value={certificate.studentName} readOnly className="form-input w-full mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Certificate Number</label>
                <input value={certificate.certificateId} readOnly className="form-input w-full mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Certificate Type</label>
                <input value="Course Certificate" readOnly className="form-input w-full mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Program</label>
                <input value={certificate.course} readOnly className="form-input w-full mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Issue Date</label>
                <input value={certificate.date} readOnly className="form-input w-full mt-1" />
              </div>

              <div className="flex items-end">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium">
                  VERIFIED
                </span>
              </div>

            </div>

            <div className="mt-8 bg-slate-100 rounded-xl p-4">
              <canvas
                ref={certificateCanvasRef}
                className="w-full rounded-lg bg-white"
              />
            </div>

            {/* BUTTONS */}
       <div className="flex flex-col sm:flex-row gap-4 mt-8">

  {/* VIEW BUTTON */}
  <button
    onClick={() => navigate(`/certificate/${certificate.certificateId}`)}
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