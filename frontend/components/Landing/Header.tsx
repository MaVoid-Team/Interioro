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
        <section className="relative flex min-h-[82dvh] w-full items-center overflow-hidden bg-surface pt-20 sm:min-h-[90dvh]">
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
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex max-w-4xl flex-col ${isRtl ? 'items-end text-end' : 'items-start text-start'}`}
                >
                    <motion.div variants={itemVariants} className="max-w-full space-y-4">
                        <h1 className="text-4xl font-serif font-bold text-white leading-[1.08] sm:text-6xl lg:text-8xl">
                            <span className="text-secondary drop-shadow-sm">
                                {t('companyName')}
                            </span>
                        </h1>
                        <p className="max-w-2xl text-base leading-relaxed text-gray-300 sm:text-xl lg:text-2xl">
                            {t('description')}
                        </p>
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4"
                    >
                        <Link href={"/products"}>
                            <Button size="lg" className="w-full px-8 text-base sm:w-auto sm:px-10">
                                {t('shopNow')}
                            </Button>
                        </Link>
                        <Link href={"/categories"}>
                            <Button variant="outline" size="lg" className="w-full border-none bg-white/10 px-8 text-base text-white backdrop-blur-md hover:bg-white/20 sm:w-auto sm:px-10">
                                {t('explore')}
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
