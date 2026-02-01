import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/product/${id}`)
            .then(res => setProduct(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);



    if (loading) return (
        <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="text-xl font-bold text-gray-500 animate-pulse">Loading specific deals for you...</div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="text-xl font-bold text-red-500 border-2 border-red-100 p-8 rounded-3xl bg-white dark:bg-slate-900 border-dashed">Listing not found</div>
        </div>
    );

    const isOwner = user && user.userId === product.sellerId;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-slate-950 transition-colors duration-300 px-4">
            <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row transition-colors">

                {/* Image Section */}
                <div className="lg:w-1/2 bg-gray-200 dark:bg-slate-800 relative group overflow-hidden">
                    <img
                        src={product.imageUrls?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"}
                        alt={product.title}
                        className="w-full h-full object-cover min-h-[400px] lg:min-h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                {/* Details Section */}
                <div className="lg:w-1/2 p-8 lg:p-14 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-wrap gap-2">
                            {isOwner && (
                                <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">Your Listing</span>
                            )}
                            <span className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-primary text-[10px] font-black rounded-full uppercase tracking-widest transition-colors">{product.condition}</span>
                        </div>
                        <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm font-medium gap-1.5 transition-colors">
                            <MapPin size={18} className="text-primary" /> {product.location || 'University Campus'}
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight transition-colors">{product.title}</h1>
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-black text-primary transition-colors">Rs. {product.price}</span>
                        <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-slate-700"></div>
                        <span className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Recently Posted'}
                        </span>
                    </div>

                    <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed transition-colors">
                        <p>{product.description}</p>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl mb-10 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 transition-colors">
                                <User size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-0.5">Verified Seller</p>
                                <p className="font-black text-gray-900 dark:text-white text-xl transition-colors">
                                    {isOwner ? 'You (The Seller)' : (product.sellerName || `Student Listing #${product.sellerId}`)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 transition-colors">
                                <span className="text-xl">📱</span>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">Mobile Number</p>
                                    <p className="font-black text-gray-900 dark:text-white text-lg transition-colors">{product.contactPhone || 'Contact not specified'}</p>
                                </div>
                            </div>

                            {!isOwner && product.contactPhone && (
                                <a
                                    href={`tel:${product.contactPhone}`}
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-green-100 dark:shadow-none"
                                >
                                    <span className="text-2xl">📞</span> Call Seller Now
                                </a>
                            )}
                        </div>
                    </div>

                    {!isOwner && (
                        <div className="mt-auto">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/messages')}
                                className="w-full btn-primary flex items-center justify-center gap-3 py-5 text-xl font-black shadow-2xl shadow-primary/30"
                            >
                                <MessageCircle size={24} /> Message via Chat
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
