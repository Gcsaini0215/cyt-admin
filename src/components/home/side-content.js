import LazyImage from "../../helpers/lazy-image";
import React, { useEffect, useState } from "react";
import { fetchById } from "../../helpers/actions";
import { getTherapists, getUsersUrl, getBookings, imagePath } from "../../helpers/urls";
import { formatDate, formatTime } from "../../helpers/times.js";

export default function SideContent() {
  const [data, setData] = useState({
    therapists: [],
    clients: [],
    appointments: [],
    monthlyRevenue: [],
    counts: {
      therapists: 0,
      resumes: 0,
      newResumes: 0,
      clients: 0,
      appointments: 0,
      totalRevenue: 0
    }
  });
  const [loading, setLoading] = useState(true);

  // Helper to handle MongoDB Decimal128 or normal numbers
  const formatCurrency = (value) => {
    if (!value) return "0.00";
    if (typeof value === 'object' && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal).toFixed(2);
    }
    return parseFloat(value).toFixed(2);
  };

  useEffect(() => {
    const getAllDashboardData = async () => {
      try {
        setLoading(true);
        const [therapistsRes, usersRes, bookingsRes] = await Promise.all([
          fetchById(getTherapists),
          fetchById(getUsersUrl),
          fetchById(getBookings)
        ]);

        const therapistsList = therapistsRes.data || [];
        const usersList = usersRes.data || [];
        const bookingsList = bookingsRes.data || [];
        
        const therapistsWithResumes = therapistsList.filter(t => t.resume);
        const resumesCount = therapistsWithResumes.length;
        
        // Calculate new resumes (those not in localStorage)
        const viewedResumes = JSON.parse(localStorage.getItem('viewedResumes') || '[]');
        const newResumesCount = therapistsWithResumes.filter(t => !viewedResumes.includes(t._id)).length;

        // Process monthly revenue for chart
        const monthlyRevenueMap = {};
        let totalRev = 0;
        
        bookingsList.forEach(booking => {
          const amount = parseFloat(booking.transaction?.amount || booking.amount || 0);
          totalRev += amount;
          
          const date = new Date(booking.booking_date || booking.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyRevenueMap[monthKey] = (monthlyRevenueMap[monthKey] || 0) + amount;
        });

        const sortedMonths = Object.keys(monthlyRevenueMap).sort();
        const monthlyRevenueData = sortedMonths.map(month => ({
          y: month,
          a: monthlyRevenueMap[month]
        }));

        // Extract unique therapists from appointments (bookings)
        const uniqueTherapistsMap = new Map();
        bookingsList.forEach(booking => {
          const therapistId = booking.therapist?._id || booking.therapist_id;
          if (therapistId && !uniqueTherapistsMap.has(therapistId)) {
            uniqueTherapistsMap.set(therapistId, {
              name: booking.therapist?.user?.name || booking.therapist_name,
              image: booking.therapist?.user?.image || booking.therapist_image,
              speciality: booking.therapist?.profile_type || booking.speciality || "Therapy",
              earned: booking.transaction?.amount || booking.amount || 0
            });
          }
        });
        const therapistsFromAppointments = Array.from(uniqueTherapistsMap.values());

        setData({
          therapists: therapistsFromAppointments.slice(0, 5),
          clients: usersList.slice(0, 5),
          appointments: bookingsList.slice(0, 5),
          monthlyRevenue: monthlyRevenueData,
          counts: {
            therapists: therapistsList.length,
            resumes: resumesCount,
            newResumes: newResumesCount,
            clients: usersList.length,
            appointments: bookingsList.length,
            totalRevenue: totalRev
          }
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllDashboardData();
  }, []);

  // Initialize Morris Chart
  useEffect(() => {
    if (loading || data.monthlyRevenue.length === 0) return;

    let morrisChart = null;
    let retryCount = 0;
    const maxRetries = 10;

    const initChart = () => {
      const chartElement = document.getElementById('revenue-chart');
      if (!chartElement) return;

      if (window.Morris && typeof window.Morris.Area === 'function') {
        chartElement.innerHTML = ''; // Clear previous chart
        morrisChart = window.Morris.Area({
          element: 'revenue-chart',
          data: data.monthlyRevenue,
          xkey: 'y',
          ykeys: ['a'],
          labels: ['Revenue'],
          lineColors: ['#22c55e'],
          lineWidth: 2,
          fillOpacity: 0.1,
          gridTextColor: '#64748b',
          gridTextSize: 12,
          gridTextWeight: '500',
          hideHover: 'auto',
          behaveLikeLine: true,
          resize: true,
          parseTime: false,
          smooth: true
        });
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(initChart, 500);
      } else {
        console.warn("Morris.js failed to load after multiple retries.");
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initChart, 100);

    return () => {
      clearTimeout(timer);
      if (morrisChart) {
        const chartElement = document.getElementById('revenue-chart');
        if (chartElement) chartElement.innerHTML = '';
      }
    };
  }, [loading, data.monthlyRevenue]);

  return (
    <>
      <div className="content container-fluid">
        {/* Stats Cards */}
        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-success border-success">
                    <i className="fe fe-users"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{loading ? "..." : data.counts.therapists}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Therapists</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-success border-success">
                    <i className="fe fe-file"></i>
                  </span>
                  <div className="dash-count">
                    <div className="d-flex align-items-center gap-2">
                      <h3>{loading ? "..." : data.counts.resumes}</h3>
                      {!loading && data.counts.newResumes > 0 && (
                        <span className="badge bg-danger rounded-pill" style={{ fontSize: '10px', marginTop: '-15px' }}>
                          {data.counts.newResumes} New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Resumes Received</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-success border-success">
                    <i className="fe fe-credit-card"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{loading ? "..." : data.counts.clients}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Clients</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-success border-success">
                    <i className="fe fe-money"></i>
                  </span>
                  <div className="dash-count">
                    <h3>₹{loading ? "..." : formatCurrency(data.counts.totalRevenue)}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Revenue</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success w-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Graph */}
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow-sm border-0 overflow-hidden">
              <div className="card-header border-0 bg-transparent py-3">
                <h4 className="card-title text-success mb-0">Revenue Analytics</h4>
              </div>
              <div className="card-body pt-0">
                <div id="revenue-chart" style={{ height: '300px' }}>
                  {loading && <div className="d-flex align-items-center justify-content-center h-100">Loading chart...</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Therapist and Client Tables */}
        <div className="row">
          <div className="col-md-6 d-flex">
            <div className="card card-table flex-fill shadow-sm border-0">
              <div className="card-header border-0 bg-transparent">
                <h4 className="card-title text-success">Therapists List</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Therapist Name</th>
                        <th>Speciality</th>
                        <th>Earned</th>
                        <th>Reviews</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                      ) : data.therapists.length > 0 ? (
                        data.therapists.map((therapist, index) => (
                          <tr key={index}>
                            <td>
                              <span className="fw-bold text-dark">{therapist.name}</span>
                            </td>
                            <td>{therapist.speciality}</td>
                            <td>₹{formatCurrency(therapist.earned)}</td>
                            <td>
                              <i className="fe fe-star text-warning"></i>
                              <i className="fe fe-star text-warning"></i>
                              <i className="fe fe-star text-warning"></i>
                              <i className="fe fe-star text-warning"></i>
                              <i className="fe fe-star-o text-secondary"></i>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="text-center">No therapists found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card card-table flex-fill shadow-sm border-0">
              <div className="card-header border-0 bg-transparent">
                <h4 className="card-title text-success">Clients List</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Phone</th>
                        <th>Last Visit</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                      ) : data.clients.length > 0 ? (
                        data.clients.map((client, index) => (
                          <tr key={index}>
                            <td>
                              <span className="fw-bold text-dark">{client.name}</span>
                            </td>
                            <td>{client.phone || "N/A"}</td>
                            <td>{client.last_visit || "N/A"}</td>
                            <td>₹{formatCurrency(client.paid)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="text-center">No clients found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="row">
          <div className="col-md-12">
            <div className="card card-table shadow-sm border-0">
              <div className="card-header border-0 bg-transparent">
                <h4 className="card-title text-success">Appointment List</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Therapist Name</th>
                        <th>Speciality</th>
                        <th>Client Name</th>
                        <th>Appointment Time</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                      ) : data.appointments.length > 0 ? (
                        data.appointments.map((booking, index) => (
                          <tr key={index}>
                            <td>
                              <span className="fw-bold text-dark">
                                {booking.therapist?.user?.name || booking.therapist_name || "N/A"}
                              </span>
                            </td>
                            <td>{booking.therapist?.profile_type || booking.speciality || "Therapy"}</td>
                            <td>
                              <span className="text-muted">
                                {booking.client?.name || booking.user_name || "N/A"}
                              </span>
                            </td>
                            <td>
                              {formatDate(booking.booking_date || booking.date)}{" "}
                              <span className="text-success d-block">
                                {formatTime(booking.booking_date || booking.date)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${booking.status?.toLowerCase() === 'completed' ? 'bg-soft-success text-success' : 'bg-soft-warning text-warning'} px-2 py-1`} style={{ fontSize: '11px' }}>
                                {booking.status?.toUpperCase() || "PENDING"}
                              </span>
                            </td>
                            <td>₹{formatCurrency(booking.transaction?.amount || booking.amount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="6" className="text-center">No appointments found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .bg-soft-success { background-color: #ecfdf5; color: #10b981; }
        .bg-soft-warning { background-color: #fffbeb; color: #d97706; }
      `}</style>
    </>
  );
}
