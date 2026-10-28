export const getOverdueStatus = (ticket) => {
  if (!ticket) return false;

  if (ticket.status === "resolved") {
    return false;
  }

  const createdAt = new Date(ticket.createdAt);
  const now = new Date();

  const difference = now.getTime() - createdAt.getTime();

  const twentyFourHours = 24 * 60 * 60 * 1000;

  return difference > twentyFourHours;
};