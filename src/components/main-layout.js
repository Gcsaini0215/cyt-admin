import React from "react";
import SideNav from "./sidenav";
import { Link } from "react-router-dom";
import LogoImg from "../assets/img/logo.png";
import SmallLogoImg from "../assets/img/logo-small.png";
export default function MainLayout(props) {
  const [open, setOpen] = React.useState(false);

  const handleMenuClick = () => {
    setOpen(!open);
  };
  return (
    <div className={open === true ? "main-wrapper slide-nav" : "main-wrapper"}>
      <style>{`
        .header {
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          height: 60px;
          z-index: 1001;
        }

        .header-left {
          width: 240px;
          background: #ffffff;
          height: 60px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          transition: all 0.4s ease;
          border-right: 1px solid #f1f5f9;
        }

        .header-left .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .header-left .logo .logo-text {
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -1px;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }

        .header-left .logo .logo-text .brand-first {
          color: #22c55e;
        }

        .header-left .logo .logo-text .brand-second {
          color: #1e293b;
          margin-left: 4px;
        }

        .top-nav-search, #toggle_btn, #mobile_btn, .mobile_btn {
          display: none !important;
        }

        .user-menu .nav-link {
          color: #64748b;
          font-size: 18px;
        }

        .user-menu .badge {
          background-color: #22c55e;
        }

        @media (max-width: 991.98px) {
          .header-left {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      <div className="header">
        <div className="header-left">
          <Link to={"/home"} className="logo">
            <div className="logo-text">
              <span className="brand-first">CHOOSE YOUR</span>
              <span className="brand-second">THERAPIST</span>
            </div>
          </Link>
        </div>

        <ul className="nav user-menu">
          <li className="nav-item dropdown noti-dropdown">
            <a
              href="#"
              className="dropdown-toggle nav-link"
              data-bs-toggle="dropdown"
            >
              <i className="fe fe-bell"></i>{" "}
              <span className="badge rounded-pill">3</span>
            </a>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <a href="#" className="clear-noti">
                  {" "}
                  Clear All{" "}
                </a>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message">
                    <a href="#">
                      <div className="notify-block d-flex">
                        <span className="avatar avatar-sm flex-shrink-0">
                          <img
                            className="avatar-img rounded-circle"
                            alt="User Image"
                            src="assets/img/doctors/doctor-thumb-01.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Dr. Ruby Perrin</span>
                            Schedule{" "}
                            <span className="noti-title">her appointment</span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              4 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="#">
                      <div className="notify-block d-flex">
                        <span className="avatar avatar-sm flex-shrink-0">
                          <img
                            className="avatar-img rounded-circle"
                            alt="User Image"
                            src="assets/img/patients/patient1.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Charlene Reed</span>
                            has booked her appointment to{" "}
                            <span className="noti-title">Dr. Ruby Perrin</span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              6 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="#">
                      <div className="notify-block d-flex">
                        <span className="avatar avatar-sm flex-shrink-0">
                          <img
                            className="avatar-img rounded-circle"
                            alt="User Image"
                            src="assets/img/patients/patient2.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Travis Trimble</span>
                            sent a amount of $210 for his{" "}
                            <span className="noti-title">appointment</span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              8 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="#">
                      <div className="notify-block d-flex">
                        <span className="avatar avatar-sm flex-shrink-0">
                          <img
                            className="avatar-img rounded-circle"
                            alt="User Image"
                            src="assets/img/patients/patient3.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Carl Kelly</span> send
                            a message{" "}
                            <span className="noti-title"> to his doctor</span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              12 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <a href="#">View all Notifications</a>
              </div>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a
              href="#"
              className="nav-link"
              data-bs-toggle="dropdown"
            >
              <span className="text-success fw-bold">Admin</span>
            </a>
            <div className="dropdown-menu">
              <div className="user-header">
                <div className="user-text">
                  <h6>Admin</h6>
                  <p className="text-muted mb-0">Administrator</p>
                </div>
              </div>
              <Link className="dropdown-item">My Profile</Link>
              <Link className="dropdown-item">Settings</Link>
              <Link className="dropdown-item">Logout</Link>
            </div>
          </li>
        </ul>
      </div>
      <SideNav />
      <div className="page-wrapper" style={{ minHeight: "354px" }}>
        {props.children}
      </div>
    </div>
  );
}
