"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { ProductCard, Product } from "@/components/products/ProductCard"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/useProducts"
import { ArrowRight } from "@phosphor-icons/react"

export function JustArrived() {
    const t = useTranslations('JustArrived')
    const locale = useLocale()
    const isRtl = locale === 'ar'
    const { fetchPublicProducts } = useProducts()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchJustArrived = async () => {
            setIsLoading(true)
            try {
                const result = await fetchPublicProducts({ page: 1, limit: 8 })
                setProducts(result?.data || [])
            } catch (error) {
                console.error('Failed to fetch just arrived products:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchJustArrived()
    }, [fetchPublicProducts])

    if (isLoading) {
        return (
            <section className="py-20 bg-surface">
                <div className="container max-w-screen-xl px-6">
                    <div className="mb-12">
                        <Skeleton className="h-12 w-64 mb-4" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="aspect-[3/4] w-full rounded-[2rem]" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (products.length === 0) return null

    return (
        <section className="py-24 bg-surface overflow-hidden">
            <div className="container max-w-screen-xl px-6">
                {/* Editorial Header */}
                <div className={`flex flex-col ${isRtl ? 'items-end text-end' : 'items-start text-start'} mb-16`}>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif font-bold tracking-tighter text-foreground mb-4"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-xl leading-relaxed font-sans"
                    >
                        {t('description')}
                    </motion.p>
                </div>

                {/* Asymmetric Curated Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {products.slice(0, 5).map((product, i) => {
                        // Create asymmetric layout: 1st product is large, others vary
                        const isMain = i === 0;
                        const isMedium = i === 1 || i === 3;
                        
                        return (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                                className={cn(
                                    "relative",
                                    isMain ? "md:col-span-7" : isMedium ? "md:col-span-5" : "md:col-span-4"
                                )}
                            >
                                <div className="h-full">
                                    <ProductCard
                                        product={product}
                                        isJustAdded={true}
                                        showMetadata={true}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className={`flex ${isRtl ? 'justify-end' : 'justify-start'} mt-16`}>
                    <Button variant="outline" size="lg" className="rounded-full px-8 group">
                        Explore All New Arrivals
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
