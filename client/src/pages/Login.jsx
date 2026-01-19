import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../axios/api';
import { Mail, Lock, Eye, EyeOff, Activity } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        setError(''); // Reset error

        try {
            const res = await login(formData);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role); 

            // Redirect based on role
            if (user.role === 'doctor') {
                navigate('/doctor-dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="font-display bg-[#f5f7f8] dark:bg-[#0f1c23] text-[#101618] dark:text-white transition-colors duration-200 h-screen flex items-center justify-center p-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

            <div className="w-full max-w-[420px] z-10">
                <div className="bg-white dark:bg-[#1a262d] rounded-xl shadow-xl overflow-hidden border border-[#dae2e7] dark:border-[#2a363d]">

                    <div className="px-6 pt-6 pb-2 text-center">
                        <div className="mb-2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#0284c5]/10 text-[#0284c5]">
                            <Activity size={24} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#101618] dark:text-white">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your HMS account.</p>
                    </div>

                    <div className="px-8 pb-6">
                        {error && (
                            <div className="mb-4 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-[#101618] dark:text-slate-200" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#dae2e7] dark:border-[#3a4b55] bg-white dark:bg-[#0f1c23] text-[#101618] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] transition-all text-sm"
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="name@hospital.com"
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-[#101618] dark:text-slate-200" htmlFor="password">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#dae2e7] dark:border-[#3a4b55] bg-white dark:bg-[#0f1c23] text-[#101618] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] transition-all text-sm"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0284c5]"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                className="w-full bg-[#0284c5] hover:bg-[#026aa0] text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-md text-sm mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>

                            <div className="text-center mt-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    New to the portal?
                                    <Link className="ml-1 font-bold text-[#0284c5] hover:underline" to="/register">Create Account</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;