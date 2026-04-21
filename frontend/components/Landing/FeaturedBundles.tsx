"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useBundles } from "@/hooks/useBundles"
import { BundleCard } from "@/components/bundles/BundleCard"
import { Bundle } from "@/types/bundle"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "@phosphor-icons/react"
import { CuratorNote } from "@/components/ui/CuratorNote"

export function FeaturedBundles() {
    const t = useTranslations('Bundles')
    const locale = useLocale()
    const isRtl = locale === 'ar'
    const { fetchPublicBundles } = useBundles()
    const [bundles, setBundles] = useState<Bundle[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadBundles = async () => {
            try {
                const result = await fetchPublicBundles({ page: 1, limit: 10 })
                setBundles(result?.bundles || [])
            } catch (error) {
                console.error('Failed to fetch bundles:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadBundles()
    }, [fetchPublicBundles])

    if (isLoading) {
        return (
            <section className="bg-surface px-4 py-12 sm:px-6 sm:py-20">
                <div className="container max-w-screen-xl">
                    <div className="h-12 w-64 bg-muted animate-pulse rounded-full mb-12 mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2rem]" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (bundles.length === 0) return null

    return (
        <section className="overflow-hidden bg-surface-container-highest py-14 sm:py-20 lg:py-24">
            <div className="container max-w-screen-xl px-4 sm:px-6">
                <div className={`mb-8 flex flex-col sm:mb-12 lg:mb-16 ${isRtl ? 'items-end text-end' : 'items-start text-start'}`}>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-3 text-3xl font-serif font-bold leading-tight text-foreground sm:text-4xl md:text-6xl"
                    >
                        {t('featured')}
                    </motion.h2>
                    <div className="mt-3 flex max-w-full gap-4">
                        <CuratorNote title="The Curator's Choice">
                            These bundles were assembled to create a cohesive atmosphere, blending textures and tones that evoke a sense of organic serenity.
                        </CuratorNote>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-center gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-8">
                    {/* Main Bundle - Large */}
                    <motion.div 
                        initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 relative"
                    >
                        <BundleCard
                            bundle={bundles[0]}
                            className="rounded-2xl shadow-2xl sm:rounded-[2rem] lg:rounded-[3rem] lg:scale-105"
                        />
                    </motion.div>

                    {/* Secondary Bundles - Stacked */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:col-span-5">
                        {bundles.slice(1, 3).map((bundle, i) => (
                            <motion.div 
                                key={bundle.id}
                                initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative"
                            >
                                <BundleCard
                                    bundle={bundle}
                                    className="rounded-2xl sm:rounded-[2rem]"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className={`mt-10 flex ${isRtl ? 'justify-end' : 'justify-start'} sm:mt-16`}>
                    <Button variant="outline" size="lg" className="group w-full rounded-full px-6 sm:w-auto sm:px-8">
                        Explore all Curations
                        <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
