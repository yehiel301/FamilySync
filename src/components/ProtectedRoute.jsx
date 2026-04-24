import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../auth';

const ProtectedRoute = () => {
    const user = getUser(); // בודק אם יש משתמש שמור ב-localStorage

    if (!user) {
        // אם אין משתמש, נווט לעמוד ההתחברות
        return <Navigate to="/login" />;
    }

    // אם יש משתמש, הצג את העמוד המבוקש
    return <Outlet />;
};

export default ProtectedRoute;