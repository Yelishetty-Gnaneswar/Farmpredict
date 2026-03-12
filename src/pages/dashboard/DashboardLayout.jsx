import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import TopNav from '../../components/dashboard/TopNav';

// This is the main wrapper layout for the logged-in user area
const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-['Inter'] text-slate-800">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-64 overflow-hidden">
                {/* Top Navbar */}
                <TopNav />

                {/* Nested Routes Render Here */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
