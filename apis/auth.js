import axios from "axios";

export function login(body) {
  const url = "/auth/login";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function loginWithGoogle(body) {
  const url = "/auth/google-login";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function register(body) {
  const url = "/auth/register";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function verifyOtp(body) {
  const url = "/auth/verify-otp";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function resendOtp(body) {
  const url = "/auth/resend-otp";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function forgotPassword(body) {
  const url = "/auth/forgot-password";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function forgotPasswordVerifyOtp(body) {
  const url = "/auth/forgot-password/verify-otp";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function forgotPasswordResendOtp(body) {
  const url = "/auth/forgot-password/resend-otp";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function forgotPasswordReset(body) {
  const url = "/auth/forgot-password/reset";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}