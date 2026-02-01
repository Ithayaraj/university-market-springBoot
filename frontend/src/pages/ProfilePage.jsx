import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, BookOpen, GraduationCap, Save, Loader, Edit3, ShieldCheck, Calendar, MapPin, Briefcase, LogOut, X, Camera, Trash2, LayoutDashboard, Award } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-primary rounded-xl transition-colors">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5 transition-colors">{label}</p>
            <p className="text-slate-900 dark:text-white font-semibold transition-colors">{value || 'Not provided'}</p>
        </div>
    </div>
);

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { showToast, showConfirm } = useNotification();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/user/profile/${user.userId}`);
            setProfile(res.data.data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/image/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = res.data.data;
            if (imageUrl) {
                setProfile(prev => ({ ...(prev || {}), avatarUrl: imageUrl }));
                setHasChanges(true);
                showToast('New photo uploaded!', 'success');
            }
        } catch (err) {
            showToast('Failed to upload image', 'error');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const removeAvatar = () => {
        setProfile(prev => ({ ...prev, avatarUrl: null }));
        setHasChanges(true);
        showToast('Photo removed. Apply to save.', 'info');
    };

    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        setHasChanges(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const updateData = {
            userId: profile?.userId || user?.userId,
            fullName: profile?.fullName || '',
            phone: profile?.phone || '',
            universityId: profile?.universityId || '',
            department: profile?.department || '',
            batch: profile?.batch || '',
            avatarUrl: profile?.avatarUrl || null
        };

        if (!updateData.userId) {
            showToast('User Session Expired. Please login.', 'error');
            setSaving(false);
            return;
        }

        try {
            await api.put('/user/profile/update', updateData);
            showToast('Profile saved successfully!', 'success');
            setHasChanges(false);
            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            showToast('Failed to save profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        const confirmed = await showConfirm({
            title: 'Sign Out?',
            message: 'Are you sure you want to log out of your account?',
            type: 'danger',
            confirmText: 'Log Out',
            cancelText: 'Stay Logged In'
        });

        if (confirmed) {
            logout();
            showToast('Logged out successfully', 'info');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin text-primary" size={40} />
                    <p className="text-slate-500 dark:text-gray-400 font-medium transition-colors">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-20 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden mb-8 transition-colors"
                >
                    {/* Background Pattern/Gradient */}
                    <div className="h-48 bg-gradient-to-r from-primary via-indigo-600 to-secondary relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-16">
                            <div className="relative group">
                                <div className="w-36 h-36 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-1.5 border-4 border-white dark:border-slate-800 transition-all duration-500 overflow-hidden transform group-hover:scale-[1.02]">
                                    <div
                                        onClick={() => isEditing && fileInputRef.current?.click()}
                                        className={`w-full h-full rounded-[2rem] flex items-center justify-center text-4xl font-black text-primary transition-colors relative overflow-hidden bg-slate-50 dark:bg-slate-800 ${isEditing ? 'cursor-pointer' : ''}`}
                                    >
                                        {profile?.avatarUrl ? (
                                            <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-900/10 flex items-center justify-center font-black">
                                                {profile?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white gap-2">
                                                {uploading ? <Loader className="animate-spin" size={24} /> : <Camera size={24} />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isEditing && profile?.avatarUrl && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeAvatar(); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg hover:bg-red-600 transition-all"
                                        title="Remove photo"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                {!isEditing && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg transition-colors">
                                        <ShieldCheck size={18} />
                                    </div>
                                )}

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="flex-1 pb-2 text-center md:text-left">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">{profile?.fullName}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium transition-colors">
                                        <Mail size={16} />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium border-l border-slate-200 dark:border-slate-800 pl-4 transition-colors">
                                        <MapPin size={16} />
                                        <span>{profile?.department || 'University Campus'}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${isEditing
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30'
                                    }`}
                            >
                                {isEditing ? <X size={20} /> : <Edit3 size={18} />}
                                {isEditing ? 'Exit Editor' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Summary & Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:sticky lg:top-24 h-full"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm dark:shadow-none border border-slate-200/60 dark:border-slate-800 transition-all hover:shadow-md flex flex-col h-full">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center justify-between transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    Profile Summary
                                </div>
                                <Award className="text-primary/40" size={20} />
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl relative overflow-hidden group transition-colors">
                                    <div className="absolute top-0 right-0 p-2 opacity-5 dark:opacity-10 text-slate-500">
                                        <GraduationCap size={48} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">Status</p>
                                    <p className="text-slate-900 dark:text-white font-extrabold flex items-center gap-2 transition-colors">
                                        Verified Student
                                        <ShieldCheck className="text-primary" size={16} />
                                    </p>
                                </div>
                                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl transition-colors">
                                    <p className="text-xs font-bold text-indigo-400 dark:text-indigo-400 uppercase tracking-wider mb-1 transition-colors">Member Since</p>
                                    <p className="text-indigo-900 dark:text-indigo-200 font-extrabold transition-colors">January 2026</p>
                                </div>
                            </div>

                            <div className="flex-grow"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full mt-8 py-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all duration-300 group border border-red-500/10 hover:border-red-500 shadow-sm"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm">Sign Out Now</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column: Detailed Info & Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 h-full"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden transition-colors h-full flex flex-col">
                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.form
                                        key="edit-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="p-8 space-y-8 flex-grow"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">Update Information</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block px-1 transition-colors">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                                                    <input
                                                        name="fullName"
                                                        value={profile?.fullName || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                                        placeholder="Your full name"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block px-1 transition-colors">Phone Number</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                                                    <input
                                                        name="phone"
                                                        value={profile?.phone || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                                        placeholder="071 234 5678"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block px-1 transition-colors">Student ID</label>
                                                <div className="relative group">
                                                    <GraduationCap className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                                                    <input
                                                        name="universityId"
                                                        value={profile?.universityId || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                                        placeholder="2021ICT..."
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block px-1 transition-colors">Department</label>
                                                <div className="relative group">
                                                    <BookOpen className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                                                    <input
                                                        name="department"
                                                        value={profile?.department || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                                        placeholder="Computer Science"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block px-1 transition-colors">Batch</label>
                                                <div className="relative group">
                                                    <Calendar className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                                                    <input
                                                        name="batch"
                                                        value={profile?.batch || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                                        placeholder="2021/2022"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Hidden field for avatarUrl to ensure it's always included */}
                                            <input type="hidden" name="avatarUrl" value={profile?.avatarUrl || ''} />
                                        </div>

                                        <div className="flex justify-end pt-6">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="btn-primary px-12 py-4 rounded-2xl text-lg font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-70 transition-all hover:-translate-y-1"
                                            >
                                                {saving ? <Loader className="animate-spin" size={24} /> : <Save size={24} />}
                                                Apply Updates
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="view-info"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-8 flex-grow"
                                    >
                                        <div className="flex items-center gap-2 mb-8">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">Information</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                            <div className="space-y-6">
                                                <h4 className="text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.25em] mb-6 flex items-center gap-3 opacity-50 transition-colors">
                                                    <span className="w-8 h-[1px] bg-primary/30"></span>
                                                    Personal Details
                                                </h4>
                                                <div className="space-y-2">
                                                    <InfoItem icon={User} label="Full Name" value={profile?.fullName} />
                                                    <div className="h-px bg-slate-100 dark:bg-slate-800/50 mx-4"></div>
                                                    <InfoItem icon={Phone} label="Contact Number" value={profile?.phone} />
                                                    <div className="h-px bg-slate-100 dark:bg-slate-800/50 mx-4"></div>
                                                    <InfoItem icon={Mail} label="University Email" value={user?.email} />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <h4 className="text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.25em] mb-6 flex items-center gap-3 opacity-50 transition-colors">
                                                    <span className="w-8 h-[1px] bg-primary/30"></span>
                                                    Academic Info
                                                </h4>
                                                <div className="space-y-2">
                                                    <InfoItem icon={GraduationCap} label="Student ID" value={profile?.universityId} />
                                                    <div className="h-px bg-slate-100 dark:bg-slate-800/50 mx-4"></div>
                                                    <InfoItem icon={BookOpen} label="Department" value={profile?.department} />
                                                    <div className="h-px bg-slate-100 dark:bg-slate-800/50 mx-4"></div>
                                                    <InfoItem icon={Calendar} label="Batch / Intake" value={profile?.batch} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
