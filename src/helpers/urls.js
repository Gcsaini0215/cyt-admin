let apiUrl;
const currentDomain = window.location.hostname;

if (currentDomain === "localhost") {
  apiUrl = "https://api.chooseyourtherapist.in/api";
} else {
  apiUrl = "https://api.chooseyourtherapist.in/api";
}
export const baseApi =
  "https://api.chooseyourtherapist.in";
export const resumePath =`${baseApi}/uploads/resumes`;
export const imagePath =`${baseApi}/uploads/images`;
export const loginUrl = `${apiUrl}/login`;
export const getTherapists = `${apiUrl}/get-therapists`;
export const getBookings = `${apiUrl}/get-booking-admin`;
export const getUsersUrl = `${apiUrl}/get-all-users`;
export const sendAproveMail = `${apiUrl}/send-aprove-mail`;
export const aprovedTherapist = `${apiUrl}/aprove-therapist`;
export const toggleActive = `${apiUrl}/toggle-active`;
export const verifyOtpUrl = `${apiUrl}/verify-otp`;
export const ShowTOPageUrl = `${apiUrl}/toggle-to-show-to-page`;
export const SetPriorityUrl = `${apiUrl}/set-priority`;
export const UpdatePaymentStatusUrl = `${apiUrl}/update-payment-status`;
