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
            <section className="bg-surface py-12 sm:py-20">
                <div className="container max-w-screen-xl px-4 sm:px-6">
                    <div className="mb-12">
                        <Skeleton className="h-12 w-64 mb-4" />
                        <Skeleton className="h-6 w-full max-w-96" />
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
        <section className="overflow-hidden bg-surface py-14 sm:py-20 lg:py-24">
            <div className="container max-w-screen-xl px-4 sm:px-6">
                {/* Editorial Header */}
                <div className={`mb-8 flex flex-col sm:mb-12 lg:mb-16 ${isRtl ? 'items-end text-end' : 'items-start text-start'}`}>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-3 text-3xl font-serif font-bold leading-tight text-foreground sm:text-4xl md:text-6xl"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                    >
                        {t('description')}
                    </motion.p>
                </div>

                {/* Asymmetric Curated Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-12 md:gap-6">
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
                                    isMain ? "sm:col-span-2 md:col-span-7" : isMedium ? "md:col-span-5" : "md:col-span-4"
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

                <div className={`mt-10 flex ${isRtl ? 'justify-end' : 'justify-start'} sm:mt-16`}>
                    <Button variant="outline" size="lg" className="group w-full rounded-full px-6 sm:w-auto sm:px-8">
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
