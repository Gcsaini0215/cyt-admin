import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React from "react";

export default function Review() {
  return (
    <div className="content container-fluid">
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title text-success">Reviews</h3>
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
                      <th className="text-white">Client Name</th>
                      <th className="text-white">Therapist Name</th>
                      <th className="text-white">Ratings</th>
                      <th className="text-white">Description</th>
                      <th className="text-white">Date</th>
                      <th className="text-white text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="fw-bold text-dark">Michelle Fairfax</span>
                      </td>
                      <td>
                        <span className="text-muted">Sofia Brient</span>
                      </td>
                      <td>
                        <i className="fe fe-star text-warning"></i>
                        <i className="fe fe-star text-warning"></i>
                        <i className="fe fe-star text-warning"></i>
                        <i className="fe fe-star text-warning"></i>
                        <i className="fe fe-star-o text-secondary"></i>
                      </td>
                      <td>
                        Great experience with the therapist. Very helpful session.
                      </td>
                      <td>
                        27 Sep 2023 <br />
                        <small className="text-muted">03.40 PM</small>
                      </td>
                      <td className="text-end">
                        <div className="actions">
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
      `}</style>
    </div>
  );
}
