import api from '@/util/api' // axios instance for API calls

export async function fetchLeaderboard(period = "all_time") {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await api.get(`/leaderboard?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    throw new Error("Failed to fetch leaderboard");
  }
}
