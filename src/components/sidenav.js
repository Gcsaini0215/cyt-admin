import "../assets/css/custom.css";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import { 
  SpaceDashboardOutlined, 
  SpaceDashboardRounded,
  PsychologyOutlined, 
  PsychologyRounded,
  Diversity3Outlined, 
  Diversity3Rounded,
  CalendarMonthOutlined, 
  CalendarMonthRounded,
  StarBorderOutlined,
  StarRounded,
  ReceiptLongOutlined,
  ReceiptLongRounded,
  CloudUploadOutlined,
  CloudUploadRounded,
  ArticleOutlined,
  ArticleRounded
} from "@mui/icons-material";

export default function SideNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { 
      path: "/home", 
      icon: <SpaceDashboardOutlined />, 
      activeIcon: <SpaceDashboardRounded />, 
      label: "Overview" 
    },
    { 
      path: "/therapists", 
      icon: <PsychologyOutlined />, 
      activeIcon: <PsychologyRounded />, 
      label: "Therapists" 
    },
    { 
      path: "/clients", 
      icon: <Diversity3Outlined />, 
      activeIcon: <Diversity3Rounded />, 
      label: "Clients" 
    },
    { 
      path: "/appointments", 
      icon: <CalendarMonthOutlined />, 
      activeIcon: <CalendarMonthRounded />, 
      label: "Schedules" 
    },
    { 
      path: "/import-clients", 
      icon: <CloudUploadOutlined />, 
      activeIcon: <CloudUploadRounded />, 
      label: "Import Clients" 
    },
    { 
      path: "/reviews", 
      icon: <StarBorderOutlined />, 
      activeIcon: <StarRounded />, 
      label: "Reviews" 
    },
    { 
      path: "/invoices", 
      icon: <ReceiptLongOutlined />, 
      activeIcon: <ReceiptLongRounded />, 
      label: "Invoices" 
    },
    { 
      path: "/blogs", 
      icon: <ArticleOutlined />, 
      activeIcon: <ArticleRounded />, 
      label: "Write Blog" 
    },
  ];

  return (
    <>
      <style>{`
        .sidebar {
          width: 240px;
          background: #ffffff;
          transition: all 0.4s ease;
          position: fixed;
          left: 0;
          top: 60px; 
          height: calc(100vh - 60px);
          z-index: 1000;
          border-right: 1px solid #f1f5f9;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .sidebar-menu {
          width: 100%;
          position: relative;
        }

        .sidebar-menu ul {
          padding: 0 15px;
          margin: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .sidebar-menu li {
          width: 100%;
          position: relative;
          display: flex;
        }

        .sidebar-menu li a {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 15px;
          border-radius: 12px;
          color: #64748b;
          transition: all 0.2s ease;
          text-decoration: none;
          gap: 12px;
          font-weight: 500;
        }

        .sidebar-menu li a svg {
          font-size: 24px;
        }

        .sidebar-menu li a span {
          font-size: 15px;
        }

        .sidebar-menu li a:hover {
          background: #f0fdf4;
          color: #22c55e;
        }

        .sidebar-menu li.active a {
          background: #22c55e;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
        }

        .page-wrapper {
          margin-left: 240px !important;
          background-color: #f8fafc;
          padding: 90px 30px 30px 30px;
          transition: all 0.4s ease;
          min-height: 100vh;
        }

        @media (max-width: 991.98px) {
          .sidebar { left: -240px; }
          .slide-nav .sidebar { left: 0; }
          .page-wrapper { margin-left: 0 !important; }
        }
      `}</style>
      
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className={currentPath === item.path ? "active" : ""}>
                  <Link to={item.path} className="link">
                    {currentPath === item.path ? item.activeIcon : item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
