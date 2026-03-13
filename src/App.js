import "./App.css";
import "./index.css";
import "./bootstrap.css";
import { Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./pages/login";
import NotFoundPage from "./pages/notfound";
import Home from "./pages/home";
import Registration from "./pages/registration";
import Appointment from "./pages/appointments";
import Client from "./pages/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Reviews from "./pages/reviews";
import Invoice from "./pages/invoice";
import Blogs from "./pages/blogs";
import ClientRegistration from "./pages/clientregistraion";
import ImportClients from "./components/client/importClients";
import TherapistRegistration from "./pages/therapistregistration";
import ProtectedRoute from "./components/ProtectedRoute";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <div className="offcanvas-overlay"></div>
        <div className="main-wrapper">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />

            <Route
              exact
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/clientregistration"
              element={
                <ProtectedRoute>
                  <ClientRegistration />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/import-clients"
              element={
                <ProtectedRoute>
                  <ImportClients />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/therapistregistration"
              element={
                <ProtectedRoute>
                  <TherapistRegistration />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/therapists"
              element={
                <ProtectedRoute>
                  <Registration />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/clients"
              element={
                <ProtectedRoute>
                  <Client />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointment />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/reviews"
              element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/invoices"
              element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/blogs"
              element={
                <ProtectedRoute>
                  <Blogs />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
