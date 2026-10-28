import api from "./api";

export const getTickets = async (params = {}) => {
  const response = await api.get("/tickets", {
    params
  });

  return response.data;
};

export const getTicket = async (id) => {
  const response = await api.get(`/tickets/${id}`);

  return response.data;
};

export const createTicket = async (data) => {
  const response = await api.post("/tickets", data);

  return response.data;
};

export const updateTicket = async (id, data) => {
  const response = await api.patch(
    `/tickets/${id}`,
    data
  );

  return response.data;
};

export const addReply = async (id, data) => {
  const response = await api.post(
    `/tickets/${id}/replies`,
    data
  );

  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`/tickets/${id}`);

  return response.data;
};