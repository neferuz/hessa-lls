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
        <div className="px-6 pb-4 font-manrope relative z-10">
            <motion.div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => {
                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => router.push(`/product/${product.id}`)}
                                className="relative aspect-[0.78/1] rounded-[24px] overflow-hidden group border border-gray-100 bg-white"
                            >
                                <Image
                                    src={product.images && product.images.length > 0 && product.images[0] ? (product.images[0].startsWith('http') || product.images[0].startsWith('/') ? product.images[0] : `${API_BASE_URL}/${product.images[0]}`) : "/product_bottle.png"}
                                    alt={product.name}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                
                                {/* Top Badge */}
                                <div className="absolute top-3 left-3">
                                    <div className="bg-[#C497A0]/90 backdrop-blur-sm h-5 px-2.5 rounded-full flex items-center justify-center shadow-none border border-white/20">
                                        <span className="text-[8px] font-black text-white uppercase tracking-[0.05em] leading-none">Coming Soon</span>
                                    </div>
                                </div>

                                {/* Content Overlay (Bottom) */}
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-white/60 backdrop-blur-md border-t border-white/40">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 pr-1">
                                            <h4 className="text-[12px] font-bold text-[#1a1a1a] leading-tight line-clamp-1">
                                                {product.name}
                                            </h4>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                                {product.category?.name || "Витамины"}
                                            </p>
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white active:scale-90 transition-all shrink-0">
                                            <ArrowUpRight size={14} strokeWidth={2.5} />
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
