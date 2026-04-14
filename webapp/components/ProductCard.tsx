"use client";
import { Star, Heart, Check, Plus, Package, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import clsx from "clsx";

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sale_price: number;
    category?: Category;
    images?: string[];
    is_active: boolean;
}

export default function ProductCard({ activeCategory }: { activeCategory: string }) {
    const router = useRouter();
    const { addItem, isInCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                setProducts(data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === "Все товары" || p.category?.name === activeCategory;
        const isActive = p.is_active !== false;
        return matchesCategory && isActive;
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.sale_price,
            image: product.images?.[0],
        });
    };

    return (
        <div className="px-5 mb-32 font-manrope">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-[17px] font-bold text-[#1a1a1a] tracking-tight font-unbounded uppercase">Популярное</h3>
                <button className="text-[10px] text-[#C497A0] font-bold uppercase tracking-widest active:opacity-70 transition-opacity">Все</button>
            </div>

            <motion.div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => {
                        const inCart = isInCart(product.id);
                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/40 backdrop-blur-md rounded-[24px] overflow-hidden flex flex-col relative border border-white/60 transition-all duration-300 group shadow-none"
                            >
                                {/* Top Image Section - Full Bleed */}
                                <div className="w-full aspect-square bg-white relative flex items-center justify-center overflow-hidden">
                                    {/* Overlays */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center justify-center border border-black/5">
                                            <span className="text-[7px] font-bold text-[#1a1a1a] uppercase tracking-[0.1em]">New</span>
                                        </div>
                                    </div>

                                    <Image
                                        src={product.images && product.images.length > 0 && product.images[0] ? (product.images[0].startsWith('http') || product.images[0].startsWith('/') ? product.images[0] : `${API_BASE_URL}/${product.images[0]}`) : "/product_bottle.png"}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                </div>

                                {/* Content Section - Compact */}
                                <div className="p-3.5 flex flex-col pt-3 pb-4">
                                    <div className="mb-2">
                                        <h4 className="text-[14px] font-bold text-[#1a1a1a] leading-tight line-clamp-1 mb-1">
                                            {product.name}
                                        </h4>
                                        <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest">Витамины</p>
                                    </div>

                                    {/* Bottom - Info only */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-[#C497A0] font-bold uppercase tracking-widest">
                                                Coming soon
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {!isLoading && filteredProducts.length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Package size={24} className="text-gray-200" />
                    </div>
                    <p className="text-[15px] text-gray-400 font-bold tracking-tight">Ничего не найдено</p>
                </div>
            )}
        </div>
    );
}
