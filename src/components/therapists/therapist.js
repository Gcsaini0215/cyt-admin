import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { 
  Person, 
  Stars, 
  CalendarToday, 
  AccountBalanceWallet, 
  CheckCircle, 
  RemoveCircle, 
  Search,
  FilterList,
  MoreVert
} from "@mui/icons-material";

const therapists = [
  { id: 1, name: "Dr. Darren Elder", specialty: "Dental", memberSince: "11 Jun 2023", time: "4.50 AM", earned: "$5000.00", status: true, img: "assets/img/doctors/doctor-thumb-02.jpg" },
  { id: 2, name: "Dr. Deborah Angel", specialty: "Cardiology", memberSince: "4 Jan 2018", time: "9.40 AM", earned: "$3300.00", status: true, img: "assets/img/doctors/doctor-thumb-03.jpg" },
  { id: 3, name: "Dr. John Gibbs", specialty: "Dental", memberSince: "21 Apr 2018", time: "02.59 PM", earned: "$4100.00", status: true, img: "assets/img/doctors/doctor-thumb-09.jpg" },
  { id: 4, name: "Dr. Katharine Berthold", specialty: "Orthopaedics", memberSince: "23 Mar 2023", time: "02.50 PM", earned: "$4000.00", status: true, img: "assets/img/doctors/doctor-thumb-06.jpg" },
  { id: 5, name: "Dr. Linda Tobin", specialty: "Neurology", memberSince: "14 Dec 2018", time: "01.59 AM", earned: "$2000.00", status: true, img: "assets/img/doctors/doctor-thumb-07.jpg" },
  { id: 6, name: "Dr. Marvin Campbell", specialty: "Orthopaedics", memberSince: "24 Jan 2023", time: "02.59 AM", earned: "$3700.00", status: true, img: "assets/img/doctors/doctor-thumb-05.jpg" },
  { id: 7, name: "Dr. Olga Barlow", specialty: "Dental", memberSince: "15 Feb 2018", time: "01.59 AM", earned: "$3100.00", status: false, img: "assets/img/doctors/doctor-thumb-10.jpg" },
  { id: 8, name: "Dr. Ruby Perrin", specialty: "Dental", memberSince: "14 Jan 2023", time: "02.59 AM", earned: "$3100.00", status: true, img: "assets/img/doctors/doctor-thumb-01.jpg" },
  { id: 9, name: "Dr. Sofia Brient", specialty: "Urology", memberSince: "5 Jul 2023", time: "12.59 AM", earned: "$3500.00", status: true, img: "assets/img/doctors/doctor-thumb-04.jpg" },
];

const StatCard = ({ icon, label, value, color }) => (
  <div className="card flex-fill">
    <div className="card-body p-3">
      <div className="d-flex align-items-center">
        <div className={`rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-${color}-light`}>
          {React.cloneElement(icon, { style: { color: `var(--bs-${color})` } })}
        </div>
        <div>
          <h6 className="text-muted mb-1 small uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>{label}</h6>
          <h4 className="mb-0 fw-bold">{value}</h4>
        </div>
      </div>
    </div>
  </div>
);

export default function Therapist() {
  return (
    <div className="content container-fluid">
      {/* Header */}
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h3 className="page-title fw-bold text-dark">Therapist Management</h3>
            <p className="text-muted mb-0 mt-1">Manage and monitor all registered therapists across the platform.</p>
          </div>
          <div className="col-auto">
            <div className="btn-group shadow-sm rounded">
              <button className="btn btn-white border d-flex align-items-center gap-2 px-3 py-2 bg-white text-dark">
                <FilterList fontSize="small" /> Filters
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2">
                <Person fontSize="small" /> Add Therapist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-4">
        <div className="col-xl-3 col-sm-6">
          <StatCard icon={<Person />} label="Total Therapists" value="1,240" color="primary" />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard icon={<Stars />} label="Active Sessions" value="45" color="success" />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard icon={<CalendarToday />} label="New Requests" value="12" color="warning" />
        </div>
        <div className="col-xl-3 col-sm-6">
          <StatCard icon={<AccountBalanceWallet />} label="Total Earnings" value="$42,500" color="info" />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <div className="input-group w-auto bg-light rounded-pill px-3 py-1">
            <Search className="text-muted" fontSize="small" />
            <input 
              type="text" 
              className="form-control border-0 bg-transparent shadow-none" 
              placeholder="Search therapist..." 
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small">Show 10 entries</span>
            <MoreVert className="text-muted cursor-pointer" />
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead className="bg-light-gray">
                <tr>
                  <th className="ps-4 py-3 border-0 text-muted fw-semibold small text-uppercase">Therapist Profile</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase">Speciality</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase">Member Since</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase text-center">Earnings</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase text-center">Status</th>
                  <th className="pe-4 py-3 border-0 text-muted fw-semibold small text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {therapists.map((item) => (
                  <tr key={item.id} className="border-bottom-faint">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-md me-3 shadow-sm rounded-circle overflow-hidden border">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="img-fluid"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{item.name}</h6>
                          <span className="text-muted extra-small">ID: #{Math.floor(1000 + Math.random() * 9000)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="badge rounded-pill bg-soft-primary px-3 py-1 text-primary">
                        {item.specialty}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="small fw-medium">{item.memberSince}</div>
                      <div className="extra-small text-muted text-uppercase">{item.time}</div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="fw-bold text-dark">{item.earned}</span>
                    </td>
                    <td className="py-3 text-center">
                      {item.status ? (
                        <span className="d-inline-flex align-items-center gap-1 text-success fw-semibold small">
                          <CheckCircle fontSize="inherit" /> Active
                        </span>
                      ) : (
                        <span className="d-inline-flex align-items-center gap-1 text-danger fw-semibold small">
                          <RemoveCircle fontSize="inherit" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <button className="btn btn-sm btn-light border me-2 hover-shadow">View</button>
                      <button className="btn btn-sm btn-outline-primary hover-shadow">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white py-3 border-top">
          <div className="row align-items-center">
            <div className="col">
              <span className="text-muted small">Showing 1 to 10 of 50 entries</span>
            </div>
            <div className="col-auto">
              <Stack spacing={2}>
                <Pagination count={5} shape="rounded" color="primary" size="small" />
              </Stack>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-light-gray { background-color: #f9fafb; }
        .bg-primary-light { background-color: rgba(13, 110, 253, 0.1); }
        .bg-success-light { background-color: rgba(25, 135, 84, 0.1); }
        .bg-warning-light { background-color: rgba(255, 193, 7, 0.1); }
        .bg-info-light { background-color: rgba(13, 202, 240, 0.1); }
        .bg-soft-primary { background-color: #e7f1ff; color: #0d6efd; }
        .extra-small { font-size: 11px; }
        .cursor-pointer { cursor: pointer; }
        .border-bottom-faint { border-bottom: 1px solid rgba(0,0,0,0.03); }
        .custom-table tbody tr:hover { background-color: #fbfcfe; transition: all 0.2s; }
        .hover-shadow:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .uppercase { text-transform: uppercase; }
        .avatar-md { width: 42px; height: 42px; }
      `}</style>
    </div>
  );
}
