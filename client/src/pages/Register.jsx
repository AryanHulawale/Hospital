import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../axios/api';
import { Mail, Lock, PersonStandingIcon, ShieldCheck } from 'lucide-react';
import { Activity } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'doctor' // Default role
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        setIsLoading(true);
        try {
            // Updated to include the role in the registration payload
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role 
            });
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="font-display bg-[#f5f7f8] dark:bg-[#0f1c23] text-[#101618] dark:text-white transition-colors duration-200 h-screen flex items-center justify-center p-2 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

            <div className="w-full max-w-[480px] z-10">
                <div className="bg-white dark:bg-[#1a262d] rounded-xl shadow-xl overflow-hidden border border-[#dae2e7] dark:border-[#2a363d]">

                    {/* Compact Header */}
                    <div className="px-6 pt-5 pb-2 text-center">
                        <div className="mb-2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#0284c5]/10 text-[#0284c5]">
                            <span className="text-2xl"><Activity size={28} /></span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#101618] dark:text-white">Create Account</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Join the medical team portal.</p>
                    </div>

                    {/* Compact Form Section */}
                    <div className="px-6 pb-6">
                        {error && (
                            <div className="mb-3 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 dark:text-red-400 text-[11px] font-medium flex items-center gap-2">
                                <span className="text-base">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                            {/* Full Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="username">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <PersonStandingIcon size={18} />
                                    </span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#dae2e7] dark:border-[#3a4b55] bg-white dark:bg-[#0f1c23] text-[#101618] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] transition-all text-sm"
                                        id="username"
                                        type="text"
                                        required
                                        placeholder="Sarah Smith"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email and Role Row */}
                            <div className="flex flex-col md:flex-row gap-2.5">
                                <div className="flex flex-col gap-1 flex-[2]">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="email">Email</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Mail size={18} />
                                        </span>
                                        <input
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#dae2e7] dark:border-[#3a4b55] bg-white dark:bg-[#0f1c23] text-sm"
                                            id="email" type="email" required placeholder="name@hospital.com"
                                            value={formData.email} onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="role">Role</label>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                            <ShieldCheck size={16} />
                                        </span>
                                        <select 
                                            id="role" 
                                            value={formData.role} 
                                            onChange={handleChange}
                                            className="w-full pl-8 pr-2 py-2 rounded-lg border border-[#dae2e7] dark:border-[#3a4b55] bg-white dark:bg-[#0f1c23] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0284c5]/20"
                                        >
                                            <option value="doctor">Doctor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Password Row */}
                            <div className="flex flex-col md:flex-row gap-2.5">
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            className="w-full pl-10 pr-9 py-2 rounded-lg border border-[#dae2e7] dark:border-[#3a4b55] bg-white dark:bg-[#0f1c23] text-sm"
                                            id="password" type={showPassword ? "text" : "password"} required placeholder="••••••••"
                                            value={formData.password} onChange={handleChange}
                                        />
                                        <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" type="button" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="confirmPassword">Confirm</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            className="w-full pl-10 pr-9 py-2 rounded-lg border border-[#dae2e7] dark:border-[#3a4b55] bg-white dark:bg-[#0f1c23] text-sm"
                                            id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required placeholder="••••••••"
                                            value={formData.confirmPassword} onChange={handleChange}
                                        />
                                        <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-1 flex flex-col gap-3">
                                <button
                                    className="w-full bg-[#0284c5] hover:bg-[#026aa0] text-white font-bold py-2.5 rounded-lg transition-colors shadow-md text-sm disabled:opacity-70"
                                    type="submit" disabled={isLoading}
                                >
                                    {isLoading ? 'Creating Account...' : 'Register'}
                                </button>
                                <p className="text-center text-xs text-slate-500">
                                    Already registered? <Link className="font-bold text-[#0284c5] hover:underline" to="/login">Sign In</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;