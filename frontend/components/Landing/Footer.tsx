"use client"

import * as React from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { MapPin, Phone, FileText, Mail } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function Footer() {
    const t = useTranslations('Footer')
    const { isAuthenticated } = useAuth()

    return (
        <footer className="w-full border-t bg-background/50 backdrop-blur-xl">
            <div className="container max-w-screen-2xl px-4 py-8 md:py-12 md:px-8 lg:px-28">
                {/* Brand Section */}
                <div className="mb-8 pb-8 border-b">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative h-14 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24 overflow-hidden rounded-lg shrink-0">
                                <Image
                                    src="/Logo.png"
                                    alt="Interioro Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-lg md:text-xl font-bold tracking-tight text-center sm:text-start">
                                {t('companyName')}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-md text-center md:text-start">
                            {t('description')}
                        </p>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12 pb-8 md:pb-12 border-b">

                    {/* Compliance Links */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-foreground text-sm md:text-base">
                            {t('complianceLinks')}
                        </h3>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/returns-exchanges"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('returnsExchanges')}
                            </Link>
                            <Link
                                href="/terms-and-conditions"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('termsConditions')}
                            </Link>
                            <Link
                                href="/privacy-policy"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('privacyPolicy')}
                            </Link>
                            <Link
                                href="/about-us"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('aboutUs')}
                            </Link>
                            <Link
                                href="/warranty-maintenance"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('warrantyMaintenance')}
                            </Link>
                        </nav>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-foreground text-sm md:text-base">
                            {t('quickLinks')}
                        </h3>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('home')}
                            </Link>
                            <Link
                                href="/products"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('products')}
                            </Link>
                            <Link
                                href="/categories"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('categories')}
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    href="/profile"
                                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {t('profile')}
                                </Link>
                            )}
                            <Link
                                href="/about-us"
                                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t('aboutUs')}
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info - Full width on mobile */}
                    <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
                        <h3 className="font-semibold text-foreground text-sm md:text-base">{t('contact')}</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <div className="flex flex-col">
                                    <span>{t('address')}</span>
                                    <span>{t('pobox')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>{t('contacts')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Info Section */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-10 mb-6 md:mb-8 text-center">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                        <span>{t('cr')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                        <span>{t('cc')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                        <span>{t('vat')}</span>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
                    <p>{t('rights')}</p>
                </div>
            </div>
        </footer>
    )
}
