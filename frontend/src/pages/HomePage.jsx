
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductModal from '../components/ProductModal';

const ProductCard = ({ product, onSelect }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (product.imageUrls && product.imageUrls.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
            }, 3000); // Rotate every 3 seconds
            return () => clearInterval(interval);
        }
    }, [product.imageUrls]);

    const user = JSON.parse(localStorage.getItem('user'));
    const isOwner = user && user.userId === product.sellerId;

    return (
        <motion.div
            onClick={() => onSelect(product)}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none overflow-hidden border border-gray-100 dark:border-slate-800 group cursor-pointer h-full flex flex-col transition-colors duration-300"
        >
            <div className="relative h-64 bg-gray-200 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={product.imageUrls?.[currentImageIndex] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"}
                        alt={product.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {isOwner && (
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10 border border-primary/20 flex items-center gap-1 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                        Yours
                    </div>
                )}

                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 z-10">
                    <MapPin size={10} /> {product.location || 'Campus'}
                </div>

                {product.imageUrls && product.imageUrls.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex gap-1 z-10">
                        {product.imageUrls.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-primary w-3' : 'bg-white/50 dark:bg-slate-400/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{product.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">{product.condition}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-2xl font-extrabold text-primary">Rs. {product.price}</span>
                        <span className="text-[10px] text-gray-400 font-medium">
                            Posted {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                    </div>
                    <span className="text-indigo-600 font-semibold text-sm group-hover:underline">View details</span>
                </div>
            </div>
        </motion.div>
    );
};

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/product/list'),
                    api.get('/category/list')
                ]);
                setProducts(prodRes.data.data || []);
                setCategories(catRes.data.data || []);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory || product.category?.name === selectedCategory || product.categoryId === selectedCategory; // checking multiple possibilities as DTO structure might vary

        // Debugging category match if needed: console.log(product.category, selectedCategory);
        // Assuming backend returns category name or ID, let's strictly compare if we know the DTO Structure. 
        // DTO has categoryId and string categoryName usually. Let's assume the frontend category list has correct names.
        // Actually, let's fix the comparison: 
        // If selectedCategory is a name, compare with product.category (if it's a name) or product.category.name (if obj).
        // If selectedCategory is an ID, compare with product.categoryId.
        // Let's rely on Names for UI buttons.
        return matchesSearch && (selectedCategory === 'All' || product.categoryName === selectedCategory || product.category?.name === selectedCategory);
    });

    return (
        <div className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-primary mb-8 rounded-b-[40px] md:rounded-b-[80px]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4"
                    >
                        Your Campus Marketplace
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-indigo-100 max-w-2xl"
                    >
                        Buy and sell books, electronics, and gear safely within your university community.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 font-display text-center">Start Exploring</h2>

                {/* Categories */}
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide justify-center items-center">
                    <div className="flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                        <motion.button
                            onClick={() => setSelectedCategory('All')}
                            className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${selectedCategory === 'All' ? 'text-white' : 'text-gray-500 hover:text-primary'
                                }`}
                        >
                            {selectedCategory === 'All' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">All Items</span>
                        </motion.button>

                        {categories.map((cat) => (
                            <motion.button
                                key={cat.categoryId}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${selectedCategory === cat.name ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                                    }`}
                            >
                                {selectedCategory === cat.name && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{cat.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Search Bar - NOW CENTERED */}
                <div className="flex justify-center mt-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md relative"
                    >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none"
                            placeholder="Search for backpacks, electronics..."
                        />
                    </motion.div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-300">
                    {selectedCategory === 'All' ? 'Fresh Recommendations' : `${selectedCategory} Results`}
                    {searchQuery && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">- searching "{searchQuery}"</span>}
                </h2>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading specific deals for you...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors duration-300">
                                <p className="text-gray-500 dark:text-gray-400">No products found for your search.</p>
                                <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4 text-primary font-bold hover:underline">Clear Search</button>
                            </div>
                        ) : filteredProducts.map((product) => (
                            <ProductCard
                                key={product.productId}
                                product={product}
                                onSelect={setSelectedProduct}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
