import { useRef, useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, MessageCircle, User, Save, Upload, Trash2, Camera, Plus, Loader } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const ProductModal = ({ product, isOpen, onClose }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { showToast, showConfirm } = useNotification();

    useEffect(() => {
        if (product) {
            setEditData({
                title: product.title || '',
                description: product.description || '',
                price: product.price || '',
                condition: product.condition || 'USED',
                location: product.location || '',
                contactPhone: product.contactPhone || '',
                imageUrls: product.imageUrls || []
            });
            setHasChanges(false);
            setIsEditing(false);
            setMessage(`Hi, I'm interested in your ${product.title}!`);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const user = JSON.parse(localStorage.getItem('user'));
    const isOwner = user && user.userId === product.sellerId;

    const handleEditChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

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
            setEditData(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...uploadedUrls]
            }));
            setHasChanges(true);
            showToast('Images uploaded!', 'success');
        } catch (err) {
            showToast('Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setEditData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
        setHasChanges(true);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await api.put('/product/update', {
                productId: product.productId,
                sellerId: product.sellerId,
                categoryId: product.categoryId,
                ...editData
            });
            showToast('Product updated successfully!', 'success');
            setHasChanges(false);
            setIsEditing(false);
            onClose();
            // Using settimeout to allow toast to be seen before reload if reload is necessary
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            showToast('Failed to update product', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = await showConfirm({
            title: 'Delete Product?',
            message: 'Are you sure you want to delete this product listing? This cannot be undone.',
            type: 'delete',
            confirmText: 'Delete',
            cancelText: 'Keep Listing'
        });

        if (confirmed) {
            try {
                await api.delete(`/product/delete/${product.productId}`);
                showToast('Product deleted successfully', 'success');
                onClose();
                setTimeout(() => window.location.reload(), 1000);
            } catch (err) {
                showToast('Failed to delete product', 'error');
            }
        }
    };



    const handleSendMessage = async () => {
        if (!user) {
            showToast("Please login to chat", "warning");
            return;
        }
        if (!message.trim()) return;

        setSending(true);
        try {
            await api.post('/chat/send', {
                senderId: user.userId,
                receiverId: product.sellerId,
                productId: product.productId,
                content: message
            });
            showToast("Message Sent!", "success");
            setMessage('');
            onClose();
        } catch (err) {
            showToast("Failed to send message", "error");
        } finally {
            setSending(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto scrollbar-hide flex flex-col md:flex-row shadow-2xl relative transition-colors duration-300"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-slate-800/80 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <X size={24} />
                    </button>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 bg-gray-100 dark:bg-slate-800 min-h-[300px] relative group">
                        {isOwner && isEditing ? (
                            <div className="p-6 h-full flex flex-col">
                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-widest">Manage Photos</h4>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <AnimatePresence>
                                        {editData.imageUrls?.map((url, idx) => (
                                            <motion.div
                                                key={url + idx}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="relative aspect-square rounded-xl overflow-hidden shadow-sm"
                                            >
                                                <img src={url} className="w-full h-full object-cover" alt="preview" />
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all bg-gray-50 dark:bg-slate-800/50"
                                    >
                                        {uploading ? <Loader className="animate-spin" size={20} /> : <Plus size={24} />}
                                        <span className="text-[10px] mt-1 font-bold">Add Photo</span>
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-auto">Add up to 4 clear photos of your item.</p>
                            </div>
                        ) : (
                            <div className="h-full relative overflow-hidden">
                                <img
                                    src={product.imageUrls?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col">
                        <div className="mb-auto">
                            {isOwner && isEditing ? (
                                // EDIT MODE FOR OWNER
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => handleEditChange('title', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Price (Rs.)</label>
                                        <input
                                            type="number"
                                            value={editData.price}
                                            onChange={(e) => handleEditChange('price', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Condition</label>
                                        <select
                                            value={editData.condition}
                                            onChange={(e) => handleEditChange('condition', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                                        >
                                            <option value="NEW">Brand New</option>
                                            <option value="USED">Used - Like New</option>
                                            <option value="USED">Used - Good</option>
                                            <option value="USED">Used - Fair</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={editData.location}
                                            onChange={(e) => handleEditChange('location', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Contact Phone</label>
                                        <input
                                            type="text"
                                            value={editData.contactPhone}
                                            onChange={(e) => handleEditChange('contactPhone', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                                            placeholder="071 XXX XXXX"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <textarea
                                            value={editData.description}
                                            onChange={(e) => handleEditChange('description', e.target.value)}
                                            rows="4"
                                            className="w-full p-2 border border-gray-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-colors"
                                        ></textarea>
                                    </div>
                                </div>
                            ) : (
                                // VIEW MODE
                                <>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {isOwner && (
                                            <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-tighter shadow-md shadow-primary/20">Yours</span>
                                        )}
                                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-primary text-xs font-bold rounded-full uppercase transition-colors uppercase">{product.condition}</span>
                                        <span className="flex items-center text-gray-500 dark:text-gray-400 text-xs gap-1 transition-colors"><MapPin size={12} /> {product.location || 'Campus'}</span>
                                        {product.createdAt && (
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full transition-colors">
                                                Posted {new Date(product.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">{product.title}</h2>
                                    <p className="text-3xl font-bold text-primary mb-3 transition-colors">Rs. {product.price}</p>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed transition-colors">
                                        {product.description}
                                    </p>

                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-2xl mb-4 transition-colors">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 transition-colors">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider transition-colors">Verified Seller</p>
                                                <p className="font-extrabold text-gray-900 dark:text-white text-lg transition-colors">{isOwner ? 'You (Owner)' : (product.sellerName || `Student #${product.sellerId}`)}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 transition-colors">
                                                <span className="text-lg">📱</span>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase transition-colors">Contact Number</p>
                                                    <p className="font-bold text-gray-900 dark:text-white transition-colors">{product.contactPhone || 'No phone provided'}</p>
                                                </div>
                                            </div>

                                            {!isOwner && product.contactPhone && (
                                                <a
                                                    href={`tel:${product.contactPhone}`}
                                                    className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-200 mt-2"
                                                >
                                                    <span className="text-xl">📞</span> Call Seller Now
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {isOwner ? (
                            <div className="mt-4 space-y-3">
                                {isEditing ? (
                                    <>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditData({
                                                        title: product.title || '',
                                                        description: product.description || '',
                                                        price: product.price || '',
                                                        condition: product.condition || 'USED',
                                                        location: product.location || ''
                                                    });
                                                    setHasChanges(false);
                                                }}
                                                className="flex-1 py-3 border border-gray-300 dark:border-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleUpdate}
                                                disabled={!hasChanges || updating}
                                                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <Save size={18} /> {updating ? 'Updating...' : 'Update Product'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2 transition-colors">This is your product listing</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                                            >
                                                Edit Product
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                                            >
                                                Delete Product
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Message Input */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 focus-within:ring-2 focus-within:ring-primary transition-all">
                                    <textarea
                                        className="w-full p-3 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none transition-colors"
                                        rows="3"
                                        placeholder={`Message the seller about ${product.title}...`}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end pt-1">
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={sending || !message.trim()}
                                            className="btn-primary py-2 px-6 text-sm flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-primary/25"
                                        >
                                            <MessageCircle size={18} /> {sending ? 'Sending...' : 'Send Message Now'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProductModal;
