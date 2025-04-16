import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedAdmin() {
    const role = sessionStorage.getItem("role");
    console.log(role)
    // Make sure the role check is case-insensitive if needed
    const isAdmin = role && role.toUpperCase() === "ADMIN";

    return isAdmin ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedAdmin;
