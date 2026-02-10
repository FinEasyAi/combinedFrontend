// src/services/authService.ts

const TOKEN_KEY = 'token';

// Helper to set a cookie
const setCookie = (name: string, value: string, days: number = 7) => {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Helper to get a cookie
const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Helper to erase a cookie
const eraseCookie = (name: string) => {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
}

export const authService = {
    // --- Login ---
    login: async (email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
        try {
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);
            params.append('grant_type', 'password');

            const response = await fetch('http://localhost:8002/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.access_token;
                setCookie(TOKEN_KEY, token);
                return { success: true, token };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.detail || 'Login failed' };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: 'Network error' };
        }
    },

    // --- Signup ---
    signup: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch('http://localhost:8002/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.json();
                const msg = Array.isArray(errorData.detail)
                    ? errorData.detail.map((d: any) => d.msg).join(', ')
                    : errorData.detail || 'Signup failed';
                return { success: false, error: msg };
            }

        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, error: 'Network error' };
        }
    },

    // --- Token Management ---
    logout: () => {
        eraseCookie(TOKEN_KEY);
    },

    getToken: () => {
        return getCookie(TOKEN_KEY);
    },

    isAuthenticated: () => {
        return !!getCookie(TOKEN_KEY);
    },

    // --- User Details ---
    getCurrentUser: async (): Promise<{ email: string; id: number; is_active: boolean; full_name?: string; name?: string } | null> => {
        const token = getCookie(TOKEN_KEY);
        if (!token) return null;

        try {
            const response = await fetch('http://localhost:8002/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    }
};
