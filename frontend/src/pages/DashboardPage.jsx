import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import StatsSection from '../components/admin/StatsSection';
import LastEventSection from '../components/admin/LestEventSection';
import LastUsersSection from '../components/admin/LastUsersSection';

import Header from "../components/Header";
import Footer from '../components/Footer';

export default function DashboardPage() {
    return (
        <>
            <Header />
            <div className="antialiased bg-gradient-to-br from-white via-indigo-100 to-indigo-300 w-full min-h-screen text-slate-300 relative py-20">
                <div className="grid grid-cols-12 mx-auto gap-2 xs:gap-4 sm:gap-6 md:gap-10 lg:gap-14 max-w-7xl my-10 px-2">
                    <Sidebar />
                    <div id="content" className="bg-white shadow-xl col-span-9 rounded-lg p-6">
                        <StatsSection />
                        <LastEventSection />
                        <LastUsersSection />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}