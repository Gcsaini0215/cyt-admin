import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, { useEffect } from "react";
import {
getBookings
} from "../../helpers/urls";
import { fetchById } from "../../helpers/actions";
import {formatDate, formatTime} from "../../helpers/times.js"
import { toast } from "react-toastify";
import PaymentStatusWidget from "./paymentStatus.js";

export default function Appointments() {
 const [data, setData] = React.useState([]); 
 const [paymentStatus, setPaymentStatus] = React.useState([]); 
  const [loading, setLoading] = React.useState(false);

    const getData = async () => {
    try {
      setLoading(true);
      const response = await fetchById(getBookings);
      if (response.status) {
        setData(response.data);
        setPaymentStatus(response.statuslist);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="content container-fluid">
        <div className="page-header mb-3">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="page-title fw-bold text-dark mb-0">Appointment Schedules</h4>
            </div>
            <div className="col-auto">
              <div className="d-flex gap-2 align-items-center">
                <span className="badge bg-soft-success text-success px-3 py-2" style={{ fontSize: '12px' }}>
                  Total Appointments: {data.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <table className="table table-hover align-middle mb-0 custom-appointment-table">
                <thead className="sticky-top" style={{ zIndex: 10, backgroundColor: '#22c55e' }}>
                  <tr>
                    <th className="ps-3 py-3 border-bottom text-white fw-bold text-uppercase" style={{ fontSize: '12px' }}>Therapist</th>
                    <th className="py-3 border-bottom text-white fw-bold text-uppercase" style={{ fontSize: '12px' }}>Service</th>
                    <th className="py-3 border-bottom text-white fw-bold text-uppercase" style={{ fontSize: '12px' }}>Client</th>
                    <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Schedule</th>
                    <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Status</th>
                    <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Payment</th>
                    <th className="pe-4 py-3 border-bottom text-white fw-bold text-uppercase text-end" style={{ fontSize: '12px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">Loading...</td>
                    </tr>
                  ) : data && data.length > 0 ? (
                    data.map((item) => (
                      <tr key={item._id}>
                        <td className="ps-3 py-3">
                          <div className="d-flex align-items-center">
                            <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{item.therapist?.user?.name || item.therapist_name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="badge bg-soft-success text-success px-2 py-1" style={{ fontSize: '11px' }}>
                            {item.therapist?.profile_type || item.speciality || "Therapy"}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-muted" style={{ fontSize: '13px' }}>{item.client?.name || item.user_name || "N/A"}</span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="d-flex flex-column">
                            <span className="text-dark fw-medium" style={{ fontSize: '13px' }}>{formatDate(item.booking_date || item.date)}</span>
                            <span className="text-success small fw-bold">{formatTime(item.booking_date || item.date)}</span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`badge ${item.status?.toLowerCase() === 'completed' ? 'bg-soft-success text-success' : 'bg-soft-warning text-warning'} px-2 py-1`} style={{ fontSize: '11px' }}>
                            {item.status?.toUpperCase() || "PENDING"}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          {item.transaction ? <PaymentStatusWidget item={item} statusList={paymentStatus} /> : <span className="text-muted small">No payment info</span>}
                        </td>
                        <td className="pe-4 py-3 text-end">
                          <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                            {item.transaction ? `₹${item.transaction?.amount?.$numberDecimal || item.transaction?.amount || item.amount}` : '-'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted small">No appointments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {data && data.length > 10 && (
            <div className="card-footer bg-white border-top-0 py-3">
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Pagination count={Math.ceil(data.length / 10)} color="success" size="small" />
              </Stack>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .bg-soft-success { background-color: #ecfdf5; color: #10b981; }
        .bg-soft-warning { background-color: #fffbeb; color: #d97706; }
        .bg-soft-info { background-color: #eff6ff; color: #3b82f6; }
        .custom-appointment-table tbody tr:hover { background-color: #f0fdf4; transition: all 0.2s; cursor: pointer; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #999; }
      `}</style>
    </>
  );
}
