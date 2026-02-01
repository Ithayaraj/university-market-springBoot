import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useNotification();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/user/login', formData);
            login(res.data.data);
            showToast('Login Successful!', 'success');
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.message || 'Login failed', 'error');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-slate-800 transition-colors">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Login to manage your listings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                        <input name="email" onChange={handleChange} placeholder="Email Address" className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                        <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                    </div>

                    <button type="submit" className="w-full btn-primary py-3 text-lg">Sign In</button>
                </form>

                <p className="text-center mt-6 text-gray-500 dark:text-gray-400">New here? <a href="/register" className="text-primary font-bold">Create Account</a></p>
            </div>
        </div>
    );
}

export default LoginPage;
