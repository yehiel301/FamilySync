import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUser, saveUser as saveUserToAuth, removeUser as removeUserFromAuth } from './auth';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(getUser());

    const saveUser = (user) => {
        saveUserToAuth(user);
        setCurrentUser(user);
    };

    const removeUser = () => {
        removeUserFromAuth();
        setCurrentUser(null);
    };

    // This effect can be used to listen to storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = () => {
            setCurrentUser(getUser());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, saveUser, removeUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);