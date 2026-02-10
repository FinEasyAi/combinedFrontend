export const authGuard = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Token missing - Redirect to common login
        window.location.href = "http://localhost:5177/login?redirect=5174";
        return null;
    }

    return token;
};
