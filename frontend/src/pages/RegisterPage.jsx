import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, BookOpen, GraduationCap } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { showToast } = useNotification();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '', password: '', role: 'STUDENT',
        fullName: '', phone: '', universityId: '', department: '', batch: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/user/register', formData);
            showToast('Registration Successful! Please login.', 'success');
            navigate('/login');
        } catch (err) {
            showToast(err.response?.data?.message || 'Registration failed', 'error');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex bg-slate-50 dark:bg-slate-950 items-center justify-center p-4 transition-colors">
            <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-slate-800 transition-colors">

                {/* Left Side - Image */}
                <div className="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-10 flex flex-col justify-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800')] bg-cover opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Join the Community</h2>
                        <p className="text-lg opacity-90 mb-8">Connect with thousands of students. Buy, sell, and trade within a trusted campus network.</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-xl">1</div>
                            <div>
                                <h4 className="font-bold">Trusted Users</h4>
                                <p className="text-sm opacity-80">Verified university emails only</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">Create Account</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">It takes less than a minute.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                                    <input name="email" onChange={handleChange} placeholder="University Email" className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                                    <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                                    <input name="fullName" onChange={handleChange} placeholder="Full Name" className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                                    <input name="phone" onChange={handleChange} placeholder="Phone Number" className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="w-full btn-primary mt-4">Next Step</button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                                    <input name="universityId" onChange={handleChange} placeholder="Student ID (e.g. 2021ICT050)" className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                                </div>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                                    <input name="department" onChange={handleChange} placeholder="Department" className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                                </div>
                                <div className="relative">
                                    <input name="batch" onChange={handleChange} placeholder="Batch (e.g. 2021/2022)" className="w-full pl-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors" required />
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors">Back</button>
                                    <button type="submit" className="w-2/3 btn-primary">Complete Registration</button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                    <p className="text-center mt-6 text-gray-500 dark:text-gray-400">Already member? <a href="/login" className="text-primary font-bold">Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
