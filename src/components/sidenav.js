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
  CalendarMonthRounded 
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
  ];

  // Calculate the active index for the sliding indicator
  const activeIndex = menuItems.findIndex(item => item.path === currentPath);

  return (
    <>
      <style>{`
        .sidebar {
          width: 90px;
          background: #ffffff; /* Ultra Clean White */
          transition: all 0.4s ease;
          position: fixed;
          left: 0;
          top: 60px; 
          height: calc(100vh - 60px);
          z-index: 1000;
          border-right: none; /* Border-less */
          padding: 40px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: none; /* Pure minimalism, no shadow initially */
        }

        .sidebar-menu {
          width: 100%;
          position: relative;
        }

        /* Liquid Sliding Indicator */
        .sliding-indicator {
          position: absolute;
          left: 15px;
          width: 60px;
          height: 60px;
          background: #f0f9ff; /* Very soft blue-tinted background */
          border-radius: 20px;
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 0;
          top: ${activeIndex !== -1 ? (activeIndex * 85) : -100}px; /* Gap (25) + Icon size (60) = 85 */
          display: ${activeIndex !== -1 ? 'block' : 'none'};
          border: 1px solid rgba(14, 165, 233, 0.1);
        }

        .sidebar-menu ul {
          padding: 0;
          margin: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 25px; /* Clean spacing */
          position: relative;
          z-index: 1;
        }

        .sidebar-menu li {
          width: 100%;
          display: flex;
          justify-content: center;
          height: 60px; /* Consistent height for calculation */
        }

        .sidebar-menu li a {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          color: #94a3b8; /* Muted slate for non-active */
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          z-index: 2;
        }

        .sidebar-menu li a svg {
          font-size: 34px; /* Large, bold icons */
        }

        /* Hover: Outline to Solid transition hint */
        .sidebar-menu li a:hover {
          color: #0ea5e9;
        }

        .sidebar-menu li.active a {
          color: #0ea5e9; /* Professional Primary Blue */
          /* No background here, handled by the sliding-indicator */
        }

        /* Small Active Dot Indicator */
        .sidebar-menu li.active::after {
          content: "";
          position: absolute;
          left: 0;
          width: 4px;
          height: 20px;
          background: #0ea5e9;
          border-radius: 0 4px 4px 0;
          top: 20px;
          transition: all 0.3s ease;
        }

        .page-wrapper {
          margin-left: 90px !important;
          background-color: #fcfdfe; /* Softest blue-white background */
          padding: 30px;
          transition: all 0.4s ease;
        }

        /* Minimalist Tooltips */
        .sidebar-menu li a::before {
          content: attr(data-label);
          position: absolute;
          left: 75px;
          background: #0f172a;
          color: #fff;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: none;
          transform: translateX(-5px);
        }

        .sidebar-menu li a:hover::before {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
          left: 85px;
        }

        @media (max-width: 991.98px) {
          .sidebar { left: -90px; }
          .slide-nav .sidebar { left: 0; }
          .page-wrapper { margin-left: 0 !important; }
        }
      `}</style>
      
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner">
          <div id="sidebar-menu" className="sidebar-menu">
            <div className="sliding-indicator"></div>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className={currentPath === item.path ? "active" : ""}>
                  <Link to={item.path} className="link" data-label={item.label}>
                    {currentPath === item.path ? item.activeIcon : item.icon}
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
