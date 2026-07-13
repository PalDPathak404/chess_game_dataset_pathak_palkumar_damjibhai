import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

export const fetchReview = async (reviewId) => {
  const { data } = await axios.get(`${API_BASE}/reviews/${reviewId}`);
  return data;
};

export const fetchReviewStatus = async (reviewId) => {
  const { data } = await axios.get(`${API_BASE}/reviews/status/${reviewId}`);
  return data;
};

export const fetchReviewByMatch = async (matchId) => {
  const { data } = await axios.get(`${API_BASE}/reviews/match/${matchId}`);
  return data;
};
