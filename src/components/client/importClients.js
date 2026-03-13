import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { 
  CloudUpload, 
  FileDownload, 
  Delete, 
  CheckCircle,
  ErrorOutline,
  Visibility
} from "@mui/icons-material";
import { 
  CircularProgress, 
  Button, 
  Card, 
  CardBody,
  IconButton,
  LinearProgress
} from "@mui/material";
import { postData } from "../../helpers/actions";
import { baseApi } from "../../helpers/urls";

export default function ImportClients() {
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setUploadProgress(0);
    setImportSuccess(false);

    const reader = new FileReader();
    
    // Simulate reading progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    reader.onload = (event) => {
      try {
        const bstr = event.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        setUploadProgress(100);
        setTimeout(() => {
          if (data.length > 0) {
            setFileData(data);
            toast.success(`${data.length} records found!`);
          } else {
            toast.error("The file is empty.");
          }
          setLoading(false);
          clearInterval(interval);
        }, 300);
      } catch (error) {
        toast.error("Error reading file. Please use a valid Excel file.");
        setLoading(false);
        clearInterval(interval);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (fileData.length === 0) return;

    setIsUploading(true);
    try {
      // Simulation: 2 seconds import delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Clients imported successfully!");
      setImportSuccess(true);
      // We keep fileData to show what was imported
    } catch (error) {
      toast.error("Failed to import clients.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetImport = () => {
    setFileData([]);
    setImportSuccess(false);
    setUploadProgress(0);
  };

  const removeRow = (index) => {
    const newData = [...fileData];
    newData.splice(index, 1);
    setFileData(newData);
  };

  return (
    <div className="content container-fluid">
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="page-title fw-bold text-dark mb-0">Import Clients</h4>
            <p className="text-muted small mb-0">Upload Excel sheet to bulk add clients</p>
          </div>
          <div className="col-auto d-flex gap-2">
            <Link to="/clients" className="btn btn-light btn-sm d-flex align-items-center gap-2 px-3">
              <Visibility sx={{ fontSize: 18 }} />
              View All Clients
            </Link>
            <a href="#" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 px-3">
              <FileDownload sx={{ fontSize: 18 }} />
              Download Template
            </a>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          {/* Success Message after import */}
          {importSuccess && (
            <div className="alert alert-success border-0 shadow-sm d-flex align-items-center gap-3 mb-4 p-4" style={{ borderRadius: '16px' }}>
              <CheckCircle sx={{ fontSize: 40 }} />
              <div className="flex-grow-1">
                <h5 className="alert-heading fw-bold mb-1">Import Successful!</h5>
                <p className="mb-0">All {fileData.length} records have been added to the client list.</p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/clients" className="btn btn-success fw-bold px-4">View Clients</Link>
                <button className="btn btn-outline-success fw-bold" onClick={resetImport}>New Import</button>
              </div>
            </div>
          )}

          {/* Upload Box */}
          {fileData.length === 0 && (
            <div className="card border-dashed mb-4" 
                 style={{ border: '2px dashed #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
              <div className="card-body py-5 text-center">
                <div className="mb-3">
                  <CloudUpload sx={{ fontSize: 64, color: '#0ea5e9', opacity: 0.5 }} />
                </div>
                <h5 className="fw-bold text-dark">Upload your Excel file</h5>
                <p className="text-muted small mb-4">File must contain columns: Name, Email, Phone</p>
                
                <div className="d-flex justify-content-center">
                  <label className={`btn btn-primary px-4 py-2 cursor-pointer ${loading ? 'disabled' : ''}`}>
                    {loading ? 'Processing...' : 'Browse Files'}
                    <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileUpload} disabled={loading} />
                  </label>
                </div>
                {loading && (
                  <div className="mt-4 mx-auto" style={{ maxWidth: '400px' }}>
                    <p className="mb-2 text-primary fw-bold small">Reading Data: {uploadProgress}%</p>
                    <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5 }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview Table */}
          {fileData.length > 0 && !importSuccess && (
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                <h6 className="mb-0 fw-bold">Data Preview ({fileData.length} Records)</h6>
                <div className="d-flex gap-2">
                  <button className="btn btn-light btn-sm text-danger fw-bold" onClick={() => setFileData([])}>Clear All</button>
                  <button 
                    className="btn btn-primary btn-sm px-4 fw-bold d-flex align-items-center gap-2" 
                    onClick={handleImport}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <CircularProgress size={16} color="inherit" />
                        Importing...
                      </>
                    ) : 'Confirm & Import'}
                  </button>
                </div>
              </div>
              <div className="table-responsive" style={{ maxHeight: '500px' }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light sticky-top" style={{ zIndex: 1 }}>
                    <tr>
                      <th className="ps-4 text-uppercase small fw-bold text-muted">Name</th>
                      <th className="text-uppercase small fw-bold text-muted">Email</th>
                      <th className="text-uppercase small fw-bold text-muted">Phone</th>
                      <th className="pe-4 text-end text-uppercase small fw-bold text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="ps-4">
                          <span className="fw-medium text-dark">{row.Name || row.name || 'N/A'}</span>
                        </td>
                        <td>{row.Email || row.email || 'N/A'}</td>
                        <td>{row.Phone || row.phone || 'N/A'}</td>
                        <td className="pe-4 text-end">
                          <IconButton size="small" color="error" onClick={() => removeRow(idx)}>
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Table after Import */}
          {importSuccess && (
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
              <div className="card-header bg-white py-3 border-bottom">
                <h6 className="mb-0 fw-bold">Imported Records Summary</h6>
              </div>
              <div className="table-responsive" style={{ maxHeight: '400px' }}>
                <table className="table align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4 text-uppercase small fw-bold text-muted">Client Name</th>
                      <th className="text-uppercase small fw-bold text-muted">Email</th>
                      <th className="text-uppercase small fw-bold text-muted text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="ps-4">
                          <span className="fw-medium text-dark">{row.Name || row.name || 'N/A'}</span>
                        </td>
                        <td>{row.Email || row.email || 'N/A'}</td>
                        <td className="text-center">
                          <span className="badge bg-soft-success text-success px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                            <CheckCircle sx={{ fontSize: 12, mr: 1 }} />
                            SUCCESS
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .border-dashed { border-style: dashed !important; }
        .bg-soft-success { background-color: #ecfdf5; color: #10b981; }
      `}</style>
    </div>
  );
}
