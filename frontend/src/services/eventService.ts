import axios from "axios";
import { Event } from "../types/Event";

const API_URL = "http://localhost:8000/api";

export const getEvents = (params?: any) => {
  return axios.get(`${API_URL}/events`, { params });
};

export const getEvent = (id: number) =>
  axios.get<Event>(`${API_URL}/events/${id}`);

export const createEvent = (data: Partial<Event>, token: string) =>
  axios.post(`${API_URL}/events`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteEvent = (id: number, token: string) =>
  axios.delete(`${API_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateEvent = (
  id: number,
  data: Partial<Event>,
  token: string
) =>
  axios.put(`${API_URL}/events/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  

// récupérer un événement par ID
export const getEventById = (id: number) => {
  return axios.get(`${API_URL}/events/${id}`);
};

