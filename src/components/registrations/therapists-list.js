import React, { useEffect } from "react";
import {
  aprovedTherapist,
  getTherapists,
  resumePath,
  sendAproveMail,
} from "../../helpers/urls";
import axios from "axios";
import { 
  Box, 
  Typography, 
  Modal, 
  CircularProgress,
  Tooltip,
  IconButton,
  Chip
} from "@mui/material";
import { 
  Email, 
  Phone, 
  Description, 
  Send, 
  CheckCircle, 
  Pending, 
  Visibility, 
  MoreVert,
  Info
} from "@mui/icons-material";
import { truncateString } from "../../helpers/string-concate";
import ActiveInactiveSwitch from "./ActiveInactiveSwitch";
import { fetchById } from "../../helpers/actions";
import { toast } from "react-toastify";
import PriorityDropdown from "./priority-dropdown";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  p: 4,
};

export default function TherapistLists() {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingModal, setLoadingModal] = React.useState(false);
  const [loadingId, setLoadingId] = React.useState();
  const [service, setSerice] = React.useState("");

  const handleOpen = (service) => {
    setSerice(service);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  
  const getData = async () => {
    try {
      const response = await fetchById(getTherapists);
      if (response.status) {
        setData(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const sendMail = async (id) => {
    try {
      setLoading(true);
      setLoadingId(id);
      const response = await axios.get(`${sendAproveMail}/${id}`);
      if (response.data.status) {
        toast.success("Mail has been sent successfully");
        getData();
      } else {
        toast.error("Error to send mail. Please contact your CTO");
      }
    } catch (error) {
      toast.error(`${error.response?.data?.message || "Error"}. Please contact your CTO`);
    } finally {
      setLoading(false);
      setLoadingId(null);
    }
  };

  const aproveProfile = async (id) => {
    try {
      setLoadingModal(true);
      const response = await fetchById(`${aprovedTherapist}/${id}`);
      if (response.status) {
        toast.success("Profile approved successfully");
        getData();
      } else {
        toast.error("Error to approve Account. Please contact your CTO");
      }
    } catch (error) {
      toast.error(`${error.response?.data?.message || "Something went wrong"}`);
    } finally {
      setLoadingModal(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="content container-fluid">
      {/* Header */}
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h3 className="page-title fw-bold text-dark">Therapist Approvals</h3>
            <p className="text-muted mb-0 mt-1">Review, verify, and approve newly registered therapists.</p>
          </div>
          <div className="col-auto">
            <div className="d-flex gap-2">
              <Chip label={`Pending: ${data.filter(i => !i.user?.is_verified).length}`} color="warning" variant="outlined" />
              <Chip label={`Approved: ${data.filter(i => i.user?.is_verified).length}`} color="success" variant="outlined" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-approval-table">
              <thead className="bg-light-gray">
                <tr>
                  <th className="ps-4 py-3 border-0 text-muted fw-semibold small text-uppercase">Therapist Info</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase">Specialization</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase text-center">Resume</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase text-center">Visibility</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase text-center">Communication</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase">Priority</th>
                  <th className="py-3 border-0 text-muted fw-semibold small text-uppercase text-center">Status</th>
                  <th className="pe-4 py-3 border-0 text-muted fw-semibold small text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id} className="border-bottom-faint">
                      <td className="ps-4 py-4">
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-dark h6 mb-1">{item.user?.name}</span>
                          <span className="text-muted small d-flex align-items-center gap-1">
                            <Email fontSize="inherit" /> {item.user?.email}
                          </span>
                          <span className="text-muted small d-flex align-items-center gap-1 mt-1">
                            <Phone fontSize="inherit" /> {item.user?.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="d-flex flex-column">
                          <span className="badge bg-soft-info text-info rounded-pill px-3 py-1 mb-2 w-fit">
                            {item.profile_type}
                          </span>
                          <span 
                            className="text-muted small cursor-pointer text-decoration-underline"
                            onClick={() => handleOpen(item.serve_type)}
                          >
                            {truncateString(item.serve_type)} <Info fontSize="inherit" />
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <a 
                          href={`${resumePath}/${item.resume}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        >
                          <Description fontSize="small" className="me-1" /> View
                        </a>
                      </td>
                      <td className="py-4 text-center">
                        <div className="d-flex justify-content-center">
                          <ActiveInactiveSwitch value={item.show_to_page} id={item._id} />
                        </div>
                        <span className="extra-small text-muted mt-1 d-block">Public Listing</span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="d-flex flex-column align-items-center">
                          {item.is_mail_sent === 1 ? (
                            <span className="text-success small fw-semibold mb-2">
                              <CheckCircle fontSize="inherit" /> Mail Sent
                            </span>
                          ) : (
                            <span className="text-danger small fw-semibold mb-2">
                              <Pending fontSize="inherit" /> No Mail
                            </span>
                          )}
                          <button 
                            className={`btn btn-sm ${loading && loadingId === item._id ? 'btn-light' : 'btn-outline-primary'} rounded-pill px-3`}
                            onClick={() => sendMail(item._id)}
                            disabled={loading}
                          >
                            {loading && loadingId === item._id ? (
                              <CircularProgress size={14} className="me-1" />
                            ) : (
                              <Send fontSize="inherit" className="me-1" />
                            )}
                            Resend
                          </button>
                        </div>
                      </td>
                      <td className="py-4">
                        <PriorityDropdown value={item.priority} id={item._id} />
                      </td>
                      <td className="py-4 text-center">
                        {item.user?.is_verified ? (
                          <span className="badge bg-soft-success text-success px-3 py-2 rounded-pill fw-bold">
                            <CheckCircle fontSize="inherit" className="me-1" /> APPROVED
                          </span>
                        ) : (
                          <span className="badge bg-soft-danger text-danger px-3 py-2 rounded-pill fw-bold">
                            <Pending fontSize="inherit" className="me-1" /> PENDING
                          </span>
                        )}
                      </td>
                      <td className="pe-4 py-4 text-end">
                        {!item.user?.is_verified ? (
                          <button 
                            className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                            onClick={() => aproveProfile(item.user?._id)}
                          >
                            Approve Now
                          </button>
                        ) : (
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="text-muted">No therapists found for approval.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service Type Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Typography variant="h6" className="fw-bold">Service Details</Typography>
            <IconButton onClick={handleClose} size="small"><MoreVert /></IconButton>
          </div>
          <div className="p-3 bg-light rounded-3">
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {service}
            </Typography>
          </div>
        </Box>
      </Modal>

      {/* Loading Modal */}
      <Modal open={loadingModal}>
        <Box sx={{ ...style, width: 300, textAlign: 'center' }}>
          <CircularProgress color="primary" className="mb-3" />
          <Typography variant="h6">Processing Approval...</Typography>
          <Typography variant="body2" className="text-muted">Please wait while we verify the account.</Typography>
        </Box>
      </Modal>

      <style>{`
        .bg-light-gray { background-color: #f9fafb; }
        .bg-soft-success { background-color: #ecfdf5; color: #10b981; }
        .bg-soft-danger { background-color: #fef2f2; color: #ef4444; }
        .bg-soft-info { background-color: #eff6ff; color: #3b82f6; }
        .extra-small { font-size: 11px; }
        .cursor-pointer { cursor: pointer; }
        .border-bottom-faint { border-bottom: 1px solid rgba(0,0,0,0.03); }
        .custom-approval-table tbody tr:hover { background-color: #fbfcfe; transition: all 0.2s; }
        .w-fit { width: fit-content; }
      `}</style>
    </div>
  );
}
