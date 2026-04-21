"use client"

import * as React from "react"
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { List } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/Landing/SearchBar"
import { Cart } from "@/components/Landing/Cart"
import { useLocale, useTranslations } from "next-intl"
import { useAuth } from "@/context/AuthContext"
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher"
import { motion } from "framer-motion"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"

export function Navbar() {
    const t = useTranslations('Navbar')
    const locale = useLocale()
    const { isAuthenticated, logout, user } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const mobileMenuSide = locale === "ar" ? "left" : "right"

    return (
        <div className="fixed top-2 inset-x-0 z-50 flex justify-center px-2 pointer-events-none sm:top-4 sm:px-4">
            <motion.header 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="glass pointer-events-auto flex h-14 w-full max-w-screen-xl items-center justify-between gap-1 rounded-full px-2 shadow-lg sm:h-16 sm:px-4 md:px-6 lg:px-8"
            >
                {/* Left: Logo */}
                <div className="flex items-center shrink-0">
                    <Link href="/" className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-primary/10 sm:h-10 sm:w-10">
                            <Image
                                src="/new-logo.png"
                                alt="Interioro Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="hidden font-serif font-bold tracking-tight lg:inline-block text-primary text-lg">
                            {t('companyName')}
                        </span>
                    </Link>
                </div>

                {/* Middle: Nav Items */}
                <nav className="hidden min-w-0 items-center gap-4 text-sm font-medium text-on-surface/70 md:flex lg:gap-7">
                    {[
                        { name: t('home'), href: "/" },
                        { name: t('products'), href: "/products" },
                        { name: t('bundles'), href: "/bundles" },
                        { name: t('categories'), href: "/categories" },
                        { name: t('designServices'), href: "/design-services" },
                    ].map((item) => (
                        <Link 
                            key={item.href}
                            href={item.href} 
                            className="hover:text-primary transition-colors duration-200 relative group whitespace-nowrap"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Link href="/orders" className="hover:text-primary transition-colors duration-200 relative group">
                            {t('orders')}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    )}
                    {isAuthenticated && user?.role === 'admin' && (
                        <Link href="/admin" className="hover:text-primary transition-colors duration-200 relative group">
                            {t('adminDashboard')}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    )}
                </nav>

                {/* Right: Actions */}
                <div className="flex min-w-0 items-center gap-0.5 sm:gap-2 md:gap-3">
                    <div className="hidden sm:block md:hidden">
                        <SearchBar />
                    </div>

                    <Cart />
                    <LanguageSwitcher />

                    <div className="hidden items-center gap-2 md:flex lg:gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        {t('profile')}
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" className="rounded-full" onClick={logout}>
                                    {t('logout')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button size="sm" className="rounded-full font-medium">
                                        {t('signup')}
                                    </Button>
                                </Link>
                            </>
                        )}
                        <div className="ms-2">
                            <SearchBar />
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                                <List className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={mobileMenuSide} className="bg-background p-0">
                            <SheetHeader className="border-b px-5 py-5 text-start">
                                <SheetTitle className="pe-8 font-serif text-xl text-primary">{t('companyName')}</SheetTitle>
                            </SheetHeader>
                            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5">
                                <div className="flex items-center justify-between gap-2 rounded-2xl bg-muted/60 p-2">
                                    <SearchBar />
                                    <Cart />
                                    <LanguageSwitcher />
                                </div>
                                <nav className="flex flex-col gap-1">
                                    {[
                                        { name: t('home'), href: "/" },
                                        { name: t('products'), href: "/products" },
                                        { name: t('bundles'), href: "/bundles" },
                                        { name: t('categories'), href: "/categories" },
                                        { name: t('designServices'), href: "/design-services" },
                                    ].map((item) => (
                                        <SheetClose key={item.href} asChild>
                                            <Link
                                                href={item.href}
                                                className="flex min-h-11 items-center rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-secondary"
                                            >
                                                {item.name}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                    {isAuthenticated && (
                                        <SheetClose asChild>
                                            <Link href="/orders" className="flex min-h-11 items-center rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-secondary">
                                                {t('orders')}
                                            </Link>
                                        </SheetClose>
                                    )}
                                    {isAuthenticated && user?.role === 'admin' && (
                                        <SheetClose asChild>
                                            <Link href="/admin" className="flex min-h-11 items-center rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-secondary">
                                                {t('adminDashboard')}
                                            </Link>
                                        </SheetClose>
                                    )}
                                </nav>

                                <div className="border-t border-border/50 my-2" />

                                <div className="flex flex-col gap-3 px-2">
                                    {isAuthenticated ? (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/profile">
                                                    <Button variant="outline" className="w-full justify-start rounded-xl">
                                                        {t('profile')}
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-destructive hover:text-destructive rounded-xl"
                                                onClick={() => {
                                                    logout()
                                                    setIsMobileMenuOpen(false)
                                                }}
                                            >
                                                {t('logout')}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/auth/login">
                                                    <Button variant="outline" className="w-full rounded-xl">
                                                        {t('login')}
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/auth/signup">
                                                    <Button className="w-full rounded-xl">
                                                        {t('signup')}
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.header>
        </div>
    )
}
