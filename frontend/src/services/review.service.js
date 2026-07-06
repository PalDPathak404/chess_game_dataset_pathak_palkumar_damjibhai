import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

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
