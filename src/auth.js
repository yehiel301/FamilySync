// src/auth.js

const USER_KEY = 'family-sync-user';

// שמירת פרטי המשתמש ב-localStorage
export const saveUser = (user) => {
    try {
        const userJson = JSON.stringify(user);
        localStorage.setItem(USER_KEY, userJson);
    } catch (error) {
        console.error("Could not save user to localStorage", error);
    }
};

// קריאת פרטי המשתמש מ-localStorage
export const getUser = () => {
    try {
        const userJson = localStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Could not get user from localStorage", error);
        return null;
    }
};

// מחיקת פרטי המשתמש (התנתקות)
export const removeUser = () => {
    try {
        localStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error("Could not remove user from localStorage", error);
    }
};