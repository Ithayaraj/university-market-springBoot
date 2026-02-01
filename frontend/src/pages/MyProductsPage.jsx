import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import ProductModal from '../components/ProductModal';

const MyProductCard = ({ product, onDelete, onEdit }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (product.imageUrls && product.imageUrls.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
            }, 3000); // 3 second interval
            return () => clearInterval(interval);
        }
    }, [product.imageUrls]);

    return (
        <motion.div key={product.productId} layout className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors duration-300">
            <div className="h-48 bg-gray-200 dark:bg-slate-800 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={product.imageUrls?.[currentImageIndex] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {product.imageUrls && product.imageUrls.length > 1 && (
                    <div className="absolute bottom-2 right-2 flex gap-1">
                        {product.imageUrls.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-1 rounded-full transition-all ${i === currentImageIndex ? 'bg-primary w-2.5' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">{product.title}</h3>
                <p className="text-primary font-bold mb-1 transition-colors">Rs. {product.price}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-4 italic transition-colors">
                    Listed on {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Recently'}
                </p>
                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={() => onEdit(product)}
                        className="flex-1 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => onDelete(product.productId)} className="flex-1 py-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 transition-colors">
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const MyProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const { showToast, showConfirm } = useNotification();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const res = await api.get('/product/list');
            const myUser = JSON.parse(localStorage.getItem('user'));
            const myProds = res.data.data.filter(p => p.sellerId === myUser.userId);
            setProducts(myProds);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await showConfirm({
            title: 'Delete Product?',
            message: 'Are you sure you want to remove this listing? This action cannot be undone.',
            type: 'delete',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });

        if (!confirmed) return;

        try {
            await api.delete(`/product/delete/${id}`);
            setProducts(products.filter(p => p.productId !== id));
            showToast('listing deleted successfully', 'success');
        } catch (err) {
            showToast("Failed to delete", 'error');
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 dark:bg-slate-950 px-4 transition-colors duration-300">
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => {
                    setSelectedProduct(null);
                    fetchMyProducts(); // refresh on close
                }}
            />
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">My Listings</h1>
                    <button onClick={() => navigate('/sell')} className="btn-primary flex items-center gap-2">
                        <Plus size={20} /> Add New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <MyProductCard
                            key={product.productId}
                            product={product}
                            onDelete={handleDelete}
                            onEdit={setSelectedProduct}
                        />
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400 transition-colors">
                            You haven't listed any items yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProductsPage;
