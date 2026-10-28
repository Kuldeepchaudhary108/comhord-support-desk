import api from "./api.js";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard");
  const data = response.data?.data || response.data || {};
  const stats = data.stats || data;
  return {
    ...stats,
    stats,
    recentTickets: data.recentTickets || [],
    success: true,
  };
};

export default { getDashboardStats };