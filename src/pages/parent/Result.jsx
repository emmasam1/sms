import React, { useRef } from "react";
import { Button, Table, Card } from "antd";
import { FilePdfOutlined, PrinterOutlined, CloseOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.jpg";

const ParentResult = () => {
  const printRef = useRef();
  const navigate = useNavigate();

  const studentInfo = {
    name: "John Doe",
    admissionNo: "ST/001",
    class: "JSS 2A",
    term: "2nd Term",
    session: "2024/2025",
  };

  const subjects = [
    { key: 1, subject: "Mathematics", test: 18, exam: 70 },
    { key: 2, subject: "English", test: 15, exam: 65 },
    { key: 3, subject: "Basic Science", test: 19, exam: 72 },
    { key: 4, subject: "Social Studies", test: 17, exam: 68 },
    { key: 5, subject: "Civic Education", test: 20, exam: 75 },
  ];

  const calculateGrade = (total) => {
    if (total >= 75) return "A";
    if (total >= 65) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "F";
  };

  const calculateRemark = (grade) => {
    switch (grade) {
      case "A": return "Excellent";
      case "B": return "Very Good";
      case "C": return "Good";
      case "D": return "Fair";
      default: return "Poor";
    }
  };

  const data = subjects.map((s) => {
    const total = s.test + s.exam;
    const grade = calculateGrade(total);
    const remark = calculateRemark(grade);
    return { ...s, total, grade, remark };
  });

  const columns = [
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Test (30%)", dataIndex: "test", key: "test" },
    { title: "Exam (70%)", dataIndex: "exam", key: "exam" },
    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Grade", dataIndex: "grade", key: "grade" },
    { title: "Remark", dataIndex: "remark", key: "remark" },
  ];

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Student Result</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
              color: #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: center;
              font-size: 14px;
            }
            th { background-color: #f8f8f8; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { width: 80px; height: 80px; border-radius: 50%; }
            .header h2 { margin: 5px 0 0; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();

    // Wait until image loads before printing
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  const handlePDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${studentInfo.name}_result.pdf`);
  };

  const totalScore = data.reduce((acc, s) => acc + s.total, 0);
  const average = (totalScore / data.length).toFixed(2);

  return (
    <div className="p-6">
      <Card
        title={<h2 className="text-xl font-semibold">Student Result</h2>}
        extra={
          <div className="flex gap-2">
            <Button
              icon={<CloseOutlined />}
              danger
              onClick={() => navigate("/home")}
            >
              Close
            </Button>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              Print
            </Button>
            <Button
              icon={<FilePdfOutlined />}
              type="primary"
              onClick={handlePDF}
            >
              Save PDF
            </Button>
          </div>
        }
      >
        <div ref={printRef} id="result-sheet">
          {/* Header */}
          <div className="text-center mb-6">
            <img src={logo} alt="School Logo" className="mx-auto w-20 h-20" />
            <h2 className="text-2xl font-bold mt-2">Bright Future Academy</h2>
            <p className="text-gray-500">
              Result Sheet - {studentInfo.term} ({studentInfo.session})
            </p>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-sm">
            <p><b>Name:</b> {studentInfo.name}</p>
            <p><b>Admission No:</b> {studentInfo.admissionNo}</p>
            <p><b>Class:</b> {studentInfo.class}</p>
            <p><b>Term:</b> {studentInfo.term}</p>
            <p><b>Session:</b> {studentInfo.session}</p>
            <p><b>Average:</b> {average}</p>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            className="mt-4"
          />

          <div className="mt-6 text-sm">
            <p><b>Teacher’s Comment:</b> Keep up the good work.</p>
            {/* <p><b>Principal’s Remark:</b> Excellent performance overall.</p> */}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ParentResult;
