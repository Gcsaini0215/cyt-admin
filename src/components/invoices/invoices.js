import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React from "react";

export default function Invoices() {
  return (
    <div className="content container-fluid">
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title text-success">Invoice Report</h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead className="bg-success text-white">
                    <tr>
                      <th className="text-white">Invoice Number</th>
                      <th className="text-white">Client ID</th>
                      <th className="text-white">Client Name</th>
                      <th className="text-white">Total Amount</th>
                      <th className="text-white">Created Date</th>
                      <th className="text-white">Status</th>
                      <th className="text-white text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="fw-bold text-dark">#IN0001</span>
                      </td>
                      <td>#CL001</td>
                      <td>
                        <span className="fw-bold text-dark">Charlene Reed</span>
                      </td>
                      <td>₹100.00</td>
                      <td>9 Sep 2023</td>
                      <td>
                        <span className="badge rounded-pill bg-soft-success text-success px-2 py-1">
                          Paid
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="actions">
                          <button className="btn btn-sm btn-outline-success me-2">
                            <i className="fe fe-pencil"></i> Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fe fe-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-white border-top-0 py-3">
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Pagination count={1} color="success" size="small" />
              </Stack>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .bg-success { background-color: #22c55e !important; }
        .bg-soft-success { background-color: #ecfdf5; color: #10b981; }
      `}</style>
    </div>
  );
}
