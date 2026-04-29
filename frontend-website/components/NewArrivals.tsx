"use client";


import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./NewArrivals.module.css";
import TextReveal from "./ui/TextReveal";

export default function NewArrivals() {
    const [activeTab, setActiveTab] = useState("Все");
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(["Все"]);

    const API_BASE_URL = "https://api.hessa.uz";

    const getImageUrl = (img: any) => {
        let url = img;
        if (typeof img === 'string' && img.startsWith('[')) {
            try { url = JSON.parse(img)[0]; } catch (e) { url = img; }
        } else if (Array.isArray(img)) {
            url = img[0];
        }

        if (!url) return "/static/vitamins-1.png";
        
        // Protocol guard
        if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:'))) {
            return url;
        }
        
        let cleanUrl = url.startsWith('/') ? url : `/${url}`;
        if (!cleanUrl.startsWith('/static/') && !cleanUrl.startsWith('/images/') && !cleanUrl.startsWith('/banners-img/')) {
            cleanUrl = `/static${cleanUrl}`;
        }
        
        return cleanUrl;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/categories`);
                const data = await res.json();
                // Map to names and ensure "Все" is first
                const catNames = ["Все", ...data.map((c: any) => c.name)];
                setCategories(catNames);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };

        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products?active_only=true`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        if (activeTab === "Все") return true;
        return p.category?.name === activeTab;
    });

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.stepTag}>
                        <span>Trending Selection</span>
                    </div>
                    <TextReveal>
                        <h2 className={styles.title}>Новинки</h2>
                    </TextReveal>
                </div>

                {/* Navigation Tabs */}
                <div className={styles.tabsContainer}>
                    <div className={styles.tabs}>
                        {categories.map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <Link href="/catalog" className={styles.viewAllBtn}>
                        <span className={styles.desktopText}>Посмотреть все</span>
                        <span className={styles.mobileText}>Все</span>
                        <ArrowUpRight size={18} />
                    </Link>
                </div>

                <div className={styles.grid}>
                    {filteredProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={styles.card}
                        >
                            {/* Card Header: Name & Arrow */}
                            <div className={styles.cardHeader}>
                                <div className={styles.headerInfo}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <p className={styles.category}>{product.category?.name}</p>
                                </div>
                            </div>

                            {/* Image & Price */}
                            <div className={`${styles.imageWrapper} ${styles[`bgVariant${(i % 4) + 1}`]}`}>
                                <Image
                                    src={getImageUrl(product.images)}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className={styles.productImage}
                                />
                                <div className={styles.floatingPrice}>
                                    Coming soon
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
