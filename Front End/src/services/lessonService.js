// Service class for fetching lesson data (mock, replace with real API calls as needed)

import api from '@/util/api' // axios instance for API calls

export async function fetchLesson(lessonId) {

  try {

    const token = localStorage.getItem("token")
    if (!token) throw new Error("No token found")

    const response = await api.get(`/lessons/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log("Fetched lesson data:", response.data)
    return response.data;

  }

  catch (error) {
    console.error("Failed to fetch course data:", error)
  }

}

/**
 * Save lesson results to backend
 * @param {string} lessonId 
 * @param {object} payload { course_id, activity_scores, overall_score }
 * @returns {Promise<UpdateLessonSubmitResponse>}
 */
export async function submitLessonResults(lessonId, payload) {
  try {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No token found")
      
    const response = await api.post(`/lessons/${lessonId}/submit`, payload,
      {
      headers: { Authorization: `Bearer ${token}` }, 
    }
    );
    return response.data;
  } 
  catch (error) {
    console.error("Failed to submit lesson:", error);
    throw new Error("Failed to submit lesson");
  }
}