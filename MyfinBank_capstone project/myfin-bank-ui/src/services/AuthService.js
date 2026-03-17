import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8081/api/user";

class AuthService {
    login(username, password) {
        return axios.post(`${USER_API_BASE_URL}/login`, { username, password });
    }

    register(user) {
        return axios.post(`${USER_API_BASE_URL}/register`, user);
    }

    // Store JWT and User Info in LocalStorage
    saveToken(token, userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
    }

    logout() {
        localStorage.clear();
        window.location.href = "/login";
    }
}

export default new AuthService();