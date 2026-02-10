
export const assistantService = {
    // Create Assistant
    createAssistant: async (name: string, file: File) => {
        const { authService } = await import('./authService');
        const token = authService.getToken();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8002/api/assistants/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                return { success: true, data: await response.json() };
            } else {
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    },

    // List Assistants
    listAssistants: async () => {
        const { authService } = await import('./authService');
        const token = authService.getToken();

        try {
            const response = await fetch('http://localhost:8002/api/assistants/list', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return { success: true, data: await response.json() };
            } else {
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    },

    // Upload Document
    uploadDocument: async (assistantId: number, file: File) => {
        const { authService } = await import('./authService');
        const token = authService.getToken();

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://localhost:8002/api/assistants/${assistantId}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                return { success: true, data: await response.json() };
            } else {
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    },

    // Chat
    chat: async (assistantId: number, message: string) => {
        const { authService } = await import('./authService');
        const token = authService.getToken();

        try {
            const response = await fetch(`http://localhost:8002/api/assistants/${assistantId}/chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                return { success: true, data: await response.json() };
            } else {
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    },

    // Analyze
    analyze: async (assistantId: number) => {
        const { authService } = await import('./authService');
        const token = authService.getToken();

        try {
            const response = await fetch(`http://localhost:8002/api/assistants/${assistantId}/analyze`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return { success: true, data: await response.json() };
            } else {
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    }
};
