// src/services/audioService.ts
import { authService } from './authService';

export interface AudioRecord {
    audio_id: number;
    name: string;
    user_id: number;
    status: string;
    description: string;
}

export const audioService = {
    // --- Upload Audio ---
    uploadAudio: async (file: File): Promise<{ success: boolean; data?: AudioRecord; error?: string }> => {
        const token = authService.getToken();
        if (!token) return { success: false, error: 'No authentication token found' };

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8002/api/audio/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorData = await response.json();
                const msg = Array.isArray(errorData.detail)
                    ? errorData.detail.map((d: any) => d.msg).join(', ')
                    : errorData.detail || 'Upload failed';
                return { success: false, error: msg };
            }
        } catch (error) {
            console.error("Upload error:", error);
            return { success: false, error: 'Network error during upload' };
        }
    },

    // --- Get User Audios ---
    getUserAudios: async (): Promise<{ success: boolean; data?: AudioRecord[]; error?: string }> => {
        const token = authService.getToken();
        if (!token) return { success: false, error: 'No authentication token found' };

        try {
            const response = await fetch('http://localhost:8002/api/audio/get', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                return { success: false, error: 'Failed to fetch audios' };
            }
        } catch (error) {
            console.error("Get audios error:", error);
            return { success: false, error: 'Network error fetching audios' };
        }
    },

    // --- Get Audio Detail ---
    getAudioDetail: async (audioId: number): Promise<{ success: boolean; data?: AudioRecord; error?: string }> => {
        const token = authService.getToken();
        if (!token) return { success: false, error: 'No authentication token found' };

        try {
            const response = await fetch(`http://localhost:8002/api/audio/get/${audioId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                return { success: false, error: 'Failed to fetch audio detail' };
            }
        } catch (error) {
            console.error("Get audio detail error:", error);
            return { success: false, error: 'Network error fetching audio detail' };
        }
    }
};
