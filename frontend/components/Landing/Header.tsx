"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

export function Header() {
    const t = useTranslations('Footer')
    const locale = useLocale()
    const isRtl = locale === 'ar'
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        // Delay text appearance to sync with fan animation (adjust time as needed)
        const timer = setTimeout(() => {
            setShowContent(true)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="relative w-full min-h-[320px] h-[52vh] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Video with Overlay */}
            <div className="absolute inset-0 z-0">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/upscaled-hero-animated.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className={`absolute inset-0 ${isRtl ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-black/80 via-black/50 to-transparent`} />
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4">
                <Card className="max-w-2xl border-none bg-transparent shadow-none">
                    <CardContent className="flex flex-col items-start text-start p-0 space-y-6">
                        <div
                            className={`space-y-2 transition-all duration-1000 ease-out transform ${showContent
                                ? 'opacity-100 translate-y-0'
                                : `opacity-0 ${isRtl ? 'translate-x-10' : '-translate-x-10'}`
                                }`}
                        >
                            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-3 sm:mb-4">
                                <span className="text-primary drop-shadow-md">
                                    {t('companyName')}
                                </span>
                            </h1>
                            <p className={`text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-lg leading-relaxed transition-all duration-1000 delay-300 ${showContent
                                ? 'opacity-100 translate-y-0'
                                : `opacity-0 ${isRtl ? 'translate-x-10' : '-translate-x-10'}`
                                }`}>
                                {t('description')}
                            </p>
                        </div>

                        <div className={`flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4 transition-all duration-1000 delay-500 ${showContent
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'
                            }`}>
                            <Link href={"/products"}>
                                <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25 text-xs sm:text-base cursor-pointer">
                                    {t('shopNow')}
                                </button>
                            </Link>
                            <Link href={"/categories"}>
                                <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-all text-xs sm:text-base cursor-pointer">
                                    {t('explore')}
                                </button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
