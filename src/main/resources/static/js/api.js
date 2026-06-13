/* =============================================
   API SERVICE LAYER
   Handles all communication with the Spring Boot Backend
   ============================================= */

const API_BASE_URL = '/api';

const api = {
    calculateZodiac: async (dob) => {
        const response = await fetch(`${API_BASE_URL}/zodiac/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dob })
        });
        if (!response.ok) throw new Error('Failed to calculate zodiac');
        return response.json();
    },

    createRecommendation: async (data) => {
        const response = await fetch(`${API_BASE_URL}/recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create recommendation');
        return response.json();
    },

    getRecommendations: async () => {
        const response = await fetch(`${API_BASE_URL}/recommendations`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        return response.json();
    },

    getGemstones: async () => {
        const response = await fetch(`${API_BASE_URL}/gemstones`);
        if (!response.ok) throw new Error('Failed to fetch gemstones');
        return response.json();
    },

    getAdminStats: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/stats`);
        if (!response.ok) throw new Error('Failed to fetch admin stats');
        return response.json();
    }
};
