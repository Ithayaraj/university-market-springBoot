import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, DollarSign, Tag, MapPin, FileText, X, Image as ImageIcon, Loader } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const SellProductPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useNotification();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '', description: '', price: '', categoryId: '', condition: 'USED', location: '', imageUrls: [], contactPhone: ''
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/category/list');
                const fetchedCats = res.data.data || [];
                // Add icons mapping manually purely for UI, as backend doesn't have icons
                const iconMap = { 'Books': '📚', 'Electronics': '💻', 'Clothing': '👕', 'Sports': '⚽', 'Furniture': '🪑', 'Other': '📦' };
                const catsWithIcons = fetchedCats.map(cat => ({
                    ...cat,
                    id: cat.categoryId, // map categoryId to id for frontend consistency if needed
                    icon: iconMap[cat.name] || '📦'
                }));
                setCategories(catsWithIcons);
            } catch (e) { console.error("Could not fetch categories"); }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCategorySelect = (id) => setFormData({ ...formData, categoryId: id });

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const res = await api.post('/image/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data.data) {
                    uploadedUrls.push(res.data.data);
                }
            }
            setFormData(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...uploadedUrls]
            }));
            showToast('Images uploaded successfully', 'success');
        } catch (err) {
            showToast('Failed to upload image', 'error');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast('Please login to sell', 'warning');
            navigate('/login');
            return;
        }

        if (formData.imageUrls.length === 0) {
            showToast("Please upload at least one image", 'warning');
            return;
        }

        setLoading(true);
        try {
            // Check if we need to create a new category or use existing
            // For now, assuming user selected a valid ID from our mock or input
            // If categoryId is empty, default to 'Other' (6)
            const catId = formData.categoryId || 6;
            const userId = user.userId || user.id || user.user_id; // Check all common keys

            const payload = {
                ...formData,
                sellerId: userId,
                price: parseFloat(formData.price),
                categoryId: parseInt(catId),
                imageUrls: formData.imageUrls
            };

            console.log('Post Product Payload:', payload);

            if (!userId) {
                showToast('User session error. Please logout and login again.', 'error');
                return;
            }

            await api.post('/product/add', payload);
            showToast('Product listed successfully!', 'success');
            navigate('/');
        } catch (err) {
            showToast('Failed to post product', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 transition-colors">Hello, {user?.fullName || 'Student'}!</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors">Ready to turn your unused items into extra cash?</p>
                </div>

                {!formData.categoryId ? (
                    // STEP 1: CATEGORY SELECTION
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white transition-colors">First, what are you selling?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {categories.map(cat => (
                                <motion.div
                                    key={cat.id}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg dark:shadow-none cursor-pointer border-2 border-transparent dark:border-slate-800 hover:border-primary dark:hover:border-primary flex flex-col items-center gap-4 transition-all"
                                >
                                    <span className="text-5xl">{cat.icon}</span>
                                    <span className="font-bold text-lg text-gray-700 dark:text-gray-300 transition-colors">{cat.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // STEP 2: DETAILS FORM
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row animate-fadeIn transition-colors">

                        {/* Form Section */}
                        <div className="flex-1 p-8 md:p-12">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Item Details</h3>
                                <button
                                    onClick={() => setFormData({ ...formData, categoryId: '' })}
                                    className="text-sm text-primary font-bold hover:underline"
                                >
                                    Change Category
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Title & Price */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Title</label>
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white transition-all outline-none font-medium"
                                            placeholder="e.g. Calculus Textbook"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Price (Rs.)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-4 text-gray-400 dark:text-gray-500" size={20} />
                                            <input
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white transition-all outline-none font-bold text-lg"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Images Drag & Drop */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 transition-colors">Photos</label>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                        <AnimatePresence>
                                            {formData.imageUrls.map((url, idx) => (
                                                <motion.div
                                                    key={url}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="relative aspect-square rounded-xl overflow-hidden group shadow-md"
                                                >
                                                    <img src={url} className="w-full h-full object-cover" alt="preview" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute top-1 right-1 bg-white/90 dark:bg-slate-800/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        <div
                                            onClick={() => fileInputRef.current.click()}
                                            className="aspect-square rounded-xl border-2 border-dashed border-indigo-200 dark:border-slate-700 bg-indigo-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors text-indigo-400 dark:text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                            {uploading ? (
                                                <Loader className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload size={24} className="mb-1" />
                                                    <span className="text-xs font-bold">Add Photo</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                    />
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Condition</label>
                                        <select
                                            name="condition"
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white outline-none transition-colors"
                                        >
                                            <option value="USED" className="dark:bg-slate-900">Used - Like New</option>
                                            <option value="USED" className="dark:bg-slate-900">Used - Good</option>
                                            <option value="USED" className="dark:bg-slate-900">Used - Fair</option>
                                            <option value="NEW" className="dark:bg-slate-900">Brand New</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 text-gray-400 dark:text-gray-500" size={20} />
                                            <input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white outline-none transition-colors"
                                                placeholder="e.g. Library"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Contact Phone (Mobile No)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-4 text-gray-400 dark:text-gray-500 font-bold">📞</span>
                                            <input
                                                name="contactPhone"
                                                value={formData.contactPhone}
                                                onChange={handleChange}
                                                className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white outline-none transition-colors"
                                                placeholder="e.g. 071 234 5678"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Description</label>
                                    <textarea
                                        name="description"
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent dark:border-slate-700 focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white outline-none resize-none transition-colors"
                                        placeholder="Tell buyers about your item..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="w-full btn-primary py-4 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Posting...' : 'Post Listing Now'}
                                </button>

                            </form>
                        </div>

                        {/* Preview / Instructions Side (Hidden on Mobile) */}
                        <div className="hidden lg:block w-1/3 bg-slate-900 p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-6">Selling Tips</h3>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <h4 className="font-bold mb-1">Clear Photos</h4>
                                            <p className="text-sm text-gray-400">Take photos in good lighting. Show any damage clearly.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <h4 className="font-bold mb-1">Fair Price</h4>
                                            <p className="text-sm text-gray-400">Check what similar items are selling for on campus.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <h4 className="font-bold mb-1">Be Responsive</h4>
                                            <p className="text-sm text-gray-400">Reply to messages quickly to sell faster.</p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="mt-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <p className="text-sm font-medium">"I sold my old textbooks within 2 days. Super easy!"</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
                                        <span className="text-xs text-gray-400">Sarah, Computer Science</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default SellProductPage;
