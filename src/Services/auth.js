import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const secretKey = 'YourSecretEncryptionKey'; // Must match the key in Login.js

const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null; // Or handle decryption failure as needed
  }
};

export const isLoggedIn = () => {
    return Cookies.get('email') && Cookies.get('token');
};

export const login = (email, token, rememberMe = false) => {
    const options = rememberMe ? { expires: 7 } : {}; // Set expiration for "Remember Me"
    Cookies.set('email', email, options);
    Cookies.set('token', token, options);
};

export const logout = () => {
    Cookies.remove('email');
    Cookies.remove('token');
    Cookies.remove('role');
};

export const getUserEmail = () => {
  const encryptedEmail = Cookies.get('email');
  return encryptedEmail ? decrypt(encryptedEmail) : null;
};

export const getUserRole = () => {
  const encryptedRole = Cookies.get('role');
  return encryptedRole ? decrypt(encryptedRole) : null;
};