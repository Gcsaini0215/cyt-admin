import { getDecodedToken, setToken } from "../helpers/auth";
import LazyImage from "../helpers/lazy-image";
import { postData } from "../helpers/actions";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isValidMail } from "../helpers/validators";
import { loginUrl, verifyOtpUrl } from "../helpers/urls";
import { toast } from "react-toastify";
export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpView, setOtpView] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.length < 7 || !isValidMail(email)) {
      toast.error("Please enter valid email address");
      return;
    }
    const value = {
      email: email.trim(),
    };

    try {
      setLoading(true);
      const response = await postData(loginUrl, value);
      if (response.status) {
        toast.success("OTP has been sent to your mail id");
        setOtpView(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = (e) => {
    const value = e.target.value;
    const formattedValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(formattedValue);
  };

  const submitOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter valid OTP");
      return;
    }
    const value = {
      email: email.trim(),
      otp: otp.trim(),
    };
    console.log(value);
    try {
      setLoading(true);
      const response = await postData(verifyOtpUrl, value);
      if (response.status) {
        setOtp("");
        if (response.data.role === 2) {
          toast.success(response.message);
          setToken(response.token);
          navigate("/home");
        } else {
          toast.error("You are not authorized to perform this action.");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  console.log('email',email);

  useEffect(() => {
    const data = getDecodedToken();
    if (data) {
      if (data.role === 2) {
        navigate("/home");
      }
    }
  }, []);
  return (
    <div className="main-wrapper login-body green-theme">
      <div className="login-wrapper">
        <div className="container">
          <div className="loginbox">
            <div className="login-left">
              <div className="founder-content">
                <h2 className="text-white">Founder</h2>
                <p className="text-white">Welcome to Choose Your Therapist</p>
              </div>
            </div>
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>Choose Your Therapist</h1>
                <p className="account-subtitle">Login to your account</p>
                <div className="mb-4">
                  <a href="/" className="btn btn-outline-success btn-sm">
                    <i className="fas fa-arrow-left me-2"></i> Go to Home
                  </a>
                </div>

                {otpView ? (
                  <>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="text"
                        value={otp}
                        onChange={handleOtp}
                        placeholder="OTP"
                      />
                    </div>
                    <div className="mb-3">
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        onClick={submitOtp}
                      >
                        Verify
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                    <div className="mb-3">
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
