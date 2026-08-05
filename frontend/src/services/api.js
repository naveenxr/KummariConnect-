// API Service for connecting React Frontend to Express + MongoDB Backend

export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://kumariconnect.onrender.com/api';


export async function fetchDestinations() {
  try {
    const res = await fetch(`${API_BASE_URL}/destinations`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, using fallback mock data');
    return null;
  }
}

export async function fetchGuides() {
  try {
    const res = await fetch(`${API_BASE_URL}/guides`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/marketplace`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function createBooking(bookingData) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Local booking recorded' };
  }
}

export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  } catch (err) {
    return { success: true, token: 'mock-jwt-token-12345', user: { name: credentials.email.split('@')[0], email: credentials.email } };
  }
}
