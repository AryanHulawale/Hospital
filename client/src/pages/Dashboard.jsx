import React, { useEffect, useState } from 'react';
import {
  Printer, Plus, TrendingUp, Users,
  Stethoscope, CalendarDays, FlaskConical, CheckCircle2, UserPlus, ShieldPlus
} from 'lucide-react';
import { fetchPatients, fetchDoctors, fetchAppointments, fetchMe, } from '../axios/api';
import AddPatientModal from '../components/AddPatientModal';


const Dashboard = () => {
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [recentActivity, setRecentActivity] = useState([]); // State for the timeline
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  // 1. Unified Fetching for Stats and Activity
  useEffect(() => {
    const getStatsAndActivity = async () => {
      try {
        const [p, d, a] = await Promise.all([fetchPatients(), fetchDoctors(), fetchAppointments()]);
        
        // --- LOGIC FOR TODAY'S APPOINTMENTS FILTER ---
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysAppointments = (a?.data || []).filter(app => {
            const appDate = new Date(app.appointmentDate).toISOString().split('T')[0];
            return appDate === todayStr;
        });

        // Update Stats (Appointments count now shows ONLY today's)
        setCounts({
          patients: p?.data?.length || 0,
          doctors: d?.data?.length || 0,
          appointments: todaysAppointments.length || 0
        });

        // --- NEW: Generate Recent Activity Logic ---
        const activities = [
          // Transform Patients into Activity Rows
          ...(p?.data || []).map(item => ({
            id: item._id,
            title: 'New Patient Registered',
            desc: `${item.fullname || item.name} joined the clinic.`,
            time: new Date(item.createdAt),
            icon: <UserPlus size={18} />,
            color: 'blue'
          })),
          // Transform Doctors into Activity Rows
          ...(d?.data || []).map(item => ({
            id: item._id,
            title: 'New Doctor Onboarded',
            desc: `Dr. ${item.name} added to staff.`,
            time: new Date(item.createdAt),
            icon: <ShieldPlus size={18} />,
            color: 'amber'
          })),
          // Transform ONLY Today's Appointments into Activity Rows
          ...todaysAppointments.map(item => ({
            id: item._id,
            title: 'Appointment Scheduled (Today)',
            desc: `Visit set for ${item.patient?.fullname || item.patient?.name || 'Patient'}`,
            time: new Date(item.createdAt),
            icon: <CheckCircle2 size={18} />,
            color: 'emerald'
          }))
        ]
        .sort((a, b) => b.time - a.time) // Sort Chronologically (Newest first)
        .slice(0, 5); // Only show latest 5 actions

        setRecentActivity(activities);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    getStatsAndActivity();
  }, []);

  // Helper to format time (e.g., "5m ago")
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchMe();
        setUsername(res.data.username);
      } catch (err) {
        console.log(err);
      }
    };
    loadUser();
  }, []);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 font-['Manrope']">

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-slate-500 text-sm">Welcome back, Dr. {username}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsModalOpen(true)}
            className="bg-[#0284c5] hover:bg-[#026aa0] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
            <Plus size={18} /> New Patient
          </button>
        </div>
      </div>

      {isModalOpen && <AddPatientModal
        onClose={() => setIsModalOpen(false)}
        refresh={() => window.location.reload()} 
      />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Patients" count={counts.patients} icon={<Users size={24} />} trend="+5%" color="blue" />
        <StatCard title="Active Doctors" count={counts.doctors} icon={<Stethoscope size={24} />} trend="Stable" color="emerald" />
        <StatCard title="Today's Appts" count={counts.appointments} icon={<CalendarDays size={24} />} trend="+12%" color="purple" />
      </div>

      {/* Activity Timeline Section */}
      <div className="bg-white dark:bg-[#1a2633] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Activity</h3>
          <button className="text-sm font-bold text-[#0284c5]">View All</button>
        </div>
        <div className="p-6 space-y-8 relative">
          <div className="absolute left-[2.75rem] top-8 bottom-8 w-px bg-slate-100 dark:bg-slate-800" />
          
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <ActivityRow 
                key={activity.id}
                icon={activity.icon} 
                title={activity.title} 
                desc={activity.desc} 
                time={formatTimeAgo(activity.time)} 
                color={activity.color} 
              />
            ))
          ) : (
            <p className="text-center text-slate-400 text-sm py-4">No recent registrations or appointments for today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Helpers --- */

const StatCard = ({ title, count, icon, trend, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
  };
  return (
    <div className="bg-white dark:bg-[#1a2633] p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">
          <TrendingUp size={10} /> {trend}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-extrabold mt-1 tracking-tight">{count}</p>
    </div>
  );
};

const ActivityRow = ({ icon, title, desc, time, color }) => {
  const iconColors = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600"
  };
  return (
    <div className="relative flex gap-6 group">
      <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#1a2633] ${iconColors[color]}`}>
        {icon}
      </div>
      <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold">{title}</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{time}</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
};

export default Dashboard;