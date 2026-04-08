"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations, useLocale } from "next-intl"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Header() {
    const t = useTranslations('Footer')
    const locale = useLocale()
    const isRtl = locale === 'ar'

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.5,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            x: isRtl ? 20 : -20 
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            x: 0,
            transition: { type: "spring" as const, stiffness: 100, damping: 20 } 
        },
    }

    return (
        <section className="relative w-full min-h-[90dvh] flex items-center overflow-hidden bg-surface">
            {/* Background Image with Editorial Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/unnamed.png"
                    alt="Interioro Wall Decor"
                    fill
                    className="object-cover"
                    priority
                />
                <div className={`absolute inset-0 ${isRtl ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-black/90 via-black/40 to-transparent`} />
            </div>

            {/* Asymmetric Content */}
            <div className="container relative z-10 mx-auto px-6 lg:px-12">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex flex-col ${isRtl ? 'items-end text-end' : 'items-start text-start'} max-w-4xl`}
                >
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold tracking-tighter text-white leading-[1.1]">
                            <span className="text-secondary drop-shadow-sm">
                                {t('companyName')}
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl leading-relaxed font-sans">
                            {t('description')}
                        </p>
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-wrap gap-4 mt-10"
                    >
                        <Link href={"/products"}>
                            <Button size="lg" className="text-base px-10">
                                {t('shopNow')}
                            </Button>
                        </Link>
                        <Link href={"/categories"}>
                            <Button variant="outline" size="lg" className="text-base px-10 border-none bg-white/10 text-white hover:bg-white/20 backdrop-blur-md">
                                {t('explore')}
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
