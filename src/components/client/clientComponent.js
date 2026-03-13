import React, { useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { getUsersUrl, deleteUserUrl } from "../../helpers/urls";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { fetchById, deleteData } from "../../helpers/actions";

export default function ClientComponent() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedClients, setSelectedClients] = React.useState([]);

  const toggleSelectAll = () => {
    if (selectedClients.length === data.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(data.map(item => item._id));
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(i => i !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedClients.length} clients?`)) {
      try {
        setLoading(true);
        const response = await deleteData(deleteUserUrl, { ids: selectedClients });
        if (response.status) {
          toast.success("Clients deleted successfully");
          setSelectedClients([]);
          getData();
        } else {
          toast.error(response.message || "Failed to delete clients");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong while deleting");
      } finally {
        setLoading(false);
      }
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await fetchById(getUsersUrl);
      if (response.status) {
        setData(response.data);
      } else {
        toast.error(response.message);
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
              <h4 className="page-title fw-bold text-dark mb-0">Client Management</h4>
            </div>
            <div className="col-auto">
              <div className="d-flex gap-2 align-items-center">
                {selectedClients.length > 0 && (
                  <button 
                    className="btn btn-danger btn-sm d-flex align-items-center gap-1 px-3 py-2 fw-bold"
                    onClick={handleDeleteSelected}
                  >
                    <DeleteOutline sx={{ fontSize: 18 }} />
                    Delete ({selectedClients.length})
                  </button>
                )}
                <span className="badge bg-soft-success text-success px-3 py-2" style={{ fontSize: '12px' }}>
                  Total Clients: {data.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <CircularProgress color="success" />
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <table className="table table-hover align-middle mb-0 custom-client-table">
                  <thead className="sticky-top" style={{ zIndex: 10, backgroundColor: '#22c55e' }}>
                    <tr>
                      <th className="ps-4 py-3 border-bottom text-white text-center" style={{ width: '50px' }}>
                        <div className="custom-control custom-checkbox">
                          <input 
                            type="checkbox" 
                            className="custom-control-input" 
                            checked={data.length > 0 && selectedClients.length === data.length}
                            onChange={toggleSelectAll}
                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                          />
                        </div>
                      </th>
                      <th className="py-3 border-bottom text-white fw-bold text-uppercase" style={{ fontSize: '12px' }}>Client Info</th>
                      <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Age</th>
                      <th className="py-3 border-bottom text-white fw-bold text-uppercase" style={{ fontSize: '12px' }}>Phone</th>
                      <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Gender</th>
                      <th className="py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>DOB</th>
                      <th className="pe-4 py-3 border-bottom text-white fw-bold text-uppercase text-center" style={{ fontSize: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((user) => (
                        <tr key={user._id} className={selectedClients.includes(user._id) ? 'table-success-soft' : ''}>
                          <td className="ps-4 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={selectedClients.includes(user._id)}
                              onChange={() => toggleSelectItem(user._id)}
                              style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                            />
                          </td>
                          <td className="ps-4 py-3">
                            <div className="d-flex flex-column">
                              <span className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>{user.name}</span>
                              <span className="text-muted" style={{ fontSize: '12px' }}>{user.email}</span>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <span className="text-dark fw-medium" style={{ fontSize: '13px' }}>{user.age || 'N/A'}</span>
                          </td>
                          <td className="py-3">
                            <span className="text-dark fw-medium" style={{ fontSize: '13px' }}>{user.phone || 'N/A'}</span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`badge ${user.gender?.toLowerCase() === 'male' ? 'bg-soft-info text-info' : 'bg-soft-danger text-danger'} px-2 py-1`} style={{ fontSize: '11px' }}>
                              {user.gender || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="text-muted" style={{ fontSize: '13px' }}>{user.dob || 'N/A'}</span>
                          </td>
                          <td className="pe-4 py-3 text-center">
                            {user.is_online === 1 ? (
                              <span className="badge bg-soft-success text-success px-2 py-1" style={{ fontSize: '11px' }}>ONLINE</span>
                            ) : (
                              <span className="badge bg-soft-secondary text-secondary px-2 py-1" style={{ fontSize: '11px' }}>OFFLINE</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted small">No clients found in the system.</td>
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
        )}
      </div>

      <style>{`
        .bg-soft-success { background-color: #ecfdf5; color: #10b981; }
        .bg-soft-info { background-color: #eff6ff; color: #3b82f6; }
        .bg-soft-danger { background-color: #fef2f2; color: #ef4444; }
        .bg-soft-secondary { background-color: #f1f5f9; color: #64748b; }
        .table-success-soft { background-color: #f0fdf4 !important; }
        .custom-client-table tbody tr:hover { background-color: #f0fdf4; transition: all 0.2s; cursor: pointer; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #999; }
      `}</style>
    </>
  );
}
