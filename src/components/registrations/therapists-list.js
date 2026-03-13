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
  IconButton,
  Chip
} from "@mui/material";
import { 
  MoreVert
} from "@mui/icons-material";
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
      <div className="page-header mb-3">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="page-title fw-bold text-dark mb-0">Therapist Approvals</h4>
          </div>
          <div className="col-auto">
            <div className="d-flex gap-2 align-items-center">
              <Chip size="small" label={`Pending: ${data.filter(i => !i.user?.is_verified).length}`} color="warning" sx={{ height: 24, fontSize: '11px' }} />
              <Chip size="small" label={`Approved: ${data.filter(i => i.user?.is_verified).length}`} color="success" sx={{ height: 24, fontSize: '11px' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive custom-scrollbar" style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
            <table className="table table-hover align-middle mb-0 custom-approval-table">
              <thead className="sticky-top" style={{ zIndex: 10, backgroundColor: '#22c55e' }}>
                <tr>
                  <th className="ps-3 py-3 border-bottom text-white fw-bold text-uppercase" style={{ fontSize: '12px' }}>Therapist</th>
                  <th className="py-3 border-bottom text-white fw-bold text-uppercase" style={{ fontSize: '12px' }}>Specialization</th>
                  <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Resume</th>
                  <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Visible</th>
                  <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Mail</th>
                  <th className="py-3 border-bottom text-white fw-bold text-uppercase" style={{ fontSize: '12px' }}>Priority</th>
                  <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Status</th>
                  <th className="pe-3 py-3 border-bottom text-white fw-bold text-uppercase text-end" style={{ fontSize: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id}>
                      <td className="ps-3 py-2">
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>{item.user?.name}</span>
                          <span className="text-dark fw-semibold" style={{ fontSize: '12px' }}>{item.user?.phone}</span>
                          <span className="text-muted" style={{ fontSize: '12px' }}>{item.user?.email}</span>
                        </div>
                      </td>
                      <td className="py-2">
                        <span className="badge bg-soft-success text-success px-2 py-1" style={{ fontSize: '12px' }}>
                          {item.profile_type}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <a 
                          href={`${resumePath}/${item.resume}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-success py-1 px-2"
                          style={{ fontSize: '12px' }}
                          onClick={() => {
                            const viewed = JSON.parse(localStorage.getItem('viewedResumes') || '[]');
                            if (!viewed.includes(item._id)) {
                              viewed.push(item._id);
                              localStorage.setItem('viewedResumes', JSON.stringify(viewed));
                            }
                          }}
                        >
                          View
                        </a>
                      </td>
                      <td className="py-2 text-center">
                        <div className="d-flex justify-content-center scale-90">
                          <ActiveInactiveSwitch value={item.show_to_page} id={item._id} />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <button 
                          className={`btn btn-sm ${loading && loadingId === item._id ? 'btn-light' : (item.is_mail_sent === 1 ? 'btn-soft-success' : 'btn-outline-success')} py-1 px-2`}
                          style={{ fontSize: '12px' }}
                          onClick={() => sendMail(item._id)}
                          disabled={loading}
                        >
                          {loading && loadingId === item._id ? <CircularProgress size={12} /> : (item.is_mail_sent === 1 ? 'Sent' : 'Send')}
                        </button>
                      </td>
                      <td className="py-2">
                        <div className="scale-90 transform-origin-left">
                          <PriorityDropdown value={item.priority} id={item._id} />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        {item.user?.is_verified ? (
                          <span className="text-success fw-bold" style={{ fontSize: '12px' }}>APPROVED</span>
                        ) : (
                          <span className="text-danger fw-bold" style={{ fontSize: '12px' }}>PENDING</span>
                        )}
                      </td>
                      <td className="pe-3 py-2 text-end">
                        {!item.user?.is_verified ? (
                          <button 
                            className="btn btn-success btn-sm py-1 px-3 fw-bold"
                            style={{ fontSize: '12px' }}
                            onClick={() => aproveProfile(item.user?._id)}
                          >
                            Approve
                          </button>
                        ) : (
                          <IconButton size="small" sx={{ p: 0 }}><MoreVert sx={{ fontSize: 20 }} /></IconButton>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted small">No pending approvals.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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

      <Modal open={loadingModal}>
        <Box sx={{ ...style, width: 300, textAlign: 'center' }}>
          <CircularProgress color="success" className="mb-3" />
          <Typography variant="h6">Processing Approval...</Typography>
          <Typography variant="body2" className="text-muted">Please wait while we verify the account.</Typography>
        </Box>
      </Modal>

      <style>{`
        .bg-light-gray { background-color: #f9fafb; }
        .bg-soft-success { background-color: #ecfdf5; color: #10b981; }
        .bg-soft-danger { background-color: #fef2f2; color: #ef4444; }
        .bg-soft-info { background-color: #eff6ff; color: #3b82f6; }
        .btn-soft-success { background-color: #ecfdf5; color: #10b981; border: 1px solid #10b981; }
        .extra-small { font-size: 10px; }
        .cursor-pointer { cursor: pointer; }
        .border-bottom-faint { border-bottom: 1px solid rgba(0,0,0,0.03); }
        .custom-approval-table tbody tr:hover { background-color: #fbfcfe; transition: all 0.2s; cursor: pointer; }
        .w-fit { width: fit-content; }
        .scale-75 { transform: scale(0.75); }
        .scale-90 { transform: scale(0.9); }
        .transform-origin-left { transform-origin: left; }
        .btn-xs { padding: 1px 6px; font-size: 10px; line-height: 1.5; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #999; }
        .btn-success { background-color: #22c55e; border-color: #22c55e; }
        .btn-success:hover { background-color: #16a34a; border-color: #16a34a; }
        .btn-outline-success { color: #22c55e; border-color: #22c55e; }
        .btn-outline-success:hover { background-color: #22c55e; color: #fff; }
      `}</style>
    </div>
  );
}
