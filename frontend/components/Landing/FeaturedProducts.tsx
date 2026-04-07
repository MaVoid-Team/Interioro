"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useProducts } from "@/hooks/useProducts"
import { ProductCard, Product } from "@/components/products/ProductCard"
import { ProductsGridSkeleton } from "@/components/products/ProductFilters"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "@phosphor-icons/react"

export function FeaturedProducts() {
    const t = useTranslations('Products')
    const locale = useLocale()
    const isRtl = locale === 'ar'
    const { fetchPublicProducts } = useProducts()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const result = await fetchPublicProducts({ page: 1, limit: 12 })
                setProducts(result?.data || [])
            } catch (error) {
                console.error('Failed to fetch products:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadProducts()
    }, [fetchPublicProducts])

    if (isLoading) {
        return (
            <section className="bg-surface-container-low px-6 py-24">
                <div className="container max-w-screen-xl">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-center mb-16 text-foreground">
                        {t('title')}
                    </h2>
                    <ProductsGridSkeleton
                        count={6}
                        gridClassName="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12"
                    />
                </div>
            </section>
        )
    }

    return (
        <section className="bg-surface-container-low py-24 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container max-w-screen-xl px-6 relative z-10">
                {/* Header */}
                <div className={`flex flex-col ${isRtl ? 'items-end text-end' : 'items-start text-start'} mb-16`}>
                    <motion.h2 
                        initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif font-bold tracking-tighter text-foreground mb-4"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans"
                    >
                        Our most coveted pieces, curated for the discerning eye.
                    </motion.p>
                </div>

                {/* Bento 2.0 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {products.slice(0, 6).map((product, i) => {
                        // Logic for Bento Layout
                        // 0: Large (4x4)
                        // 1: Medium (4x2)
                        // 2: Medium (4x2)
                        // 3: Medium (4x2)
                        // 4: Medium (4x2)
                        // 5: Large (4x4)
                        
                        const isLarge = i === 0 || i === 5;
                        const gridSpan = isLarge ? "md:col-span-4 md:row-span-2" : "md:col-span-4";

                        return (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ 
                                    delay: i * 0.1, 
                                    type: "spring", 
                                    stiffness: 100, 
                                    damping: 20 
                                }}
                                whileHover={{ y: -10 }}
                                className={cn("relative h-full", gridSpan)}
                            >
                                <ProductCard
                                    product={product}
                                    showMetadata={true}
                                    showLowStockWarning={true}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                <div className={`flex ${isRtl ? 'justify-end' : 'justify-start'} mt-16`}>
                    <Button variant="outline" size="lg" className="rounded-full px-8 group">
                        View Full Collection
                        <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
