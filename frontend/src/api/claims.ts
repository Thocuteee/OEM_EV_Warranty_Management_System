export const getClaimsFromAPI = async () => {
  try {
    const res = await fetch("/api/claims");
    return await res.json();
  } catch (error) {
    console.error("Error fetching claims:", error);
    return [];
  }
};