import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  Users,
  LogOut,
  Bell,
  UserCircle
} from 'lucide-react';
import { fetchMe } from '../axios/api';
import GlobalSearch from './GlobalSearch';

const Layout = ({ children }) => {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(localStorage.getItem('role') || 'doctor');

  // Define nav items based on role
  const adminNav = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Appointments', path: '/appointments', icon: <CalendarDays size={20} /> },
    { name: 'Doctors', path: '/doctors', icon: <Stethoscope size={20} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
  ];

  const doctorNav = [
    { name: 'My Schedule', path: '/doctor-dashboard', icon: <LayoutDashboard size={20} /> },
    // { name: 'All Appointments', path: '/appointments', icon: <CalendarDays size={20} /> },
    // { name: 'Patients List', path: '/patients', icon: <Users size={20} /> },
  ];

  // Select which navigation to show
  const navItems = role === 'admin' ? adminNav : doctorNav;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchMe();
        setUsername(res.data.username);
        // Sync role from API if available, fallback to localStorage
        if(res.data.role) {
            setRole(res.data.role);
            localStorage.setItem('role', res.data.role);
        }
      } catch (err) {
        console.log("Error loading user layout:", err);
      }
    };
    loadUser();
  }, []);


  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f1c23] text-slate-900 dark:text-slate-100 overflow-hidden font-['Manrope']">

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#1a2633] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 z-20 transition-all">
        <div className="h-20 p-5 pl-10 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-[#0284c5] p-2 rounded-lg text-white">
              <Stethoscope size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">MediCare</h1>
              <p className="text-[#0284c5] text-[10px] font-bold tracking-widest uppercase">
                {role === 'admin' ? 'Admin Panel' : 'Doctor Portal'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === item.path
                ? 'bg-[#0284c5]/10 text-[#0284c5] font-bold'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#0284c5]'
                }`}
            >
              <span className={`${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Role Badge & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 space-y-2">
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{role} Account</span>
            </div>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-bold">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-[#1a2633]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
          <div className="flex-1 max-w-lg">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-[#0284c5] transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2633]"></span>
            </button>

            <div className="flex items-center gap-3 bg-white dark:bg-[#1a2633] px-3 py-1.5 pl-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="h-8 w-8 rounded-full bg-[#0284c5] text-white flex items-center justify-center font-bold text-xs">
                {username ? username.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none">
                    {username || 'User'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium capitalize">{role}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#0f1c23]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;