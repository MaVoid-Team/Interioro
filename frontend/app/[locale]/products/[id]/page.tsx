"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useCart } from "@/context/CartContext"
import { useManufacturers } from "@/hooks/useManufacturers"
import { useProducts } from "@/hooks/useProducts"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, ArrowLeft, Package, Tag, Layers } from "lucide-react"
import Image from "next/image"

interface ProductDetails {
    id: number
    name: string
    sku: string
    price: string
    specs: Record<string, string>
    stockStatusOverride: string | null
    manufacturerId: number
    category: {
        id: number
        name: string
    }
    productType: {
        id: number
        name: string
    }
    imageUrl?: string | null
    isPurchasable?: boolean
    stockLabel?: string
    quantity?: number
}

export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const t = useTranslations('ProductPage')
    const tProducts = useTranslations('Products')
    const tCommon = useTranslations('Common')
    const { addToCart, isAdding } = useCart()
    const { manufacturers } = useManufacturers()
    const { fetchPublicProductById } = useProducts()

    const [product, setProduct] = useState<ProductDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Get manufacturer from hook data
    const manufacturer = product?.manufacturerId
        ? manufacturers.find(m => m.id === product.manufacturerId)
        : null

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const productData = await fetchPublicProductById(Number(params.id))

                if (!productData) {
                    throw new Error('Product not found')
                }

                setProduct(productData as ProductDetails)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product')
            } finally {
                setIsLoading(false)
            }
        }

        if (params.id) {
            loadProduct()
        }
    }, [params.id, fetchPublicProductById])

    if (isLoading) {
        return (
            <div className="container max-w-7xl py-8 px-4 md:px-28">
                {/* Back button skeleton */}
                <Skeleton className="h-10 w-24 mb-6" />

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image skeleton */}
                    <Card className="overflow-hidden">
                        <Skeleton className="aspect-square" />
                    </Card>

                    {/* Details skeleton */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-9 w-3/4" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Skeleton className="h-10 w-32" />
                                <Separator />
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-28" />
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex justify-between">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-11 w-full" />
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="container max-w-7xl py-8 px-4">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="h-4 w-4 me-2" />
                    {t('back')}
                </Button>
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">{error || t('notFound')}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto min-h-screen max-w-screen-3xl bg-surface px-4 py-8 sm:py-10 md:px-8 lg:px-28 lg:py-12">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 sm:mb-10 lg:mb-12"
            >
                <Button variant="ghost" onClick={() => router.back()} className="rounded-full px-6 glass hover:bg-surface-container-low transition-all">
                    <ArrowLeft className="h-4 w-4 me-2" />
                    {t('back')}
                </Button>
            </motion.div>

            <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left Column: The Visual Focus */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-7"
                >
                    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-low shadow-xl sm:rounded-[2rem] lg:rounded-[4rem] lg:shadow-2xl">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                unoptimized
                                className="object-contain p-3 transition-transform duration-700 group-hover:scale-105 sm:p-4"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Package className="h-32 w-32 text-muted-foreground/20" />
                            </div>
                        )}
                        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/45 p-3 text-white/90 backdrop-blur-md pointer-events-none sm:inset-x-6 sm:bottom-6 sm:p-5 lg:inset-x-8 lg:bottom-8 lg:rounded-3xl lg:p-6">
                            <p className="mb-1 text-xs font-medium italic opacity-80 sm:text-sm">{t('curatorNoteTitle')}</p>
                            <p className="line-clamp-3 text-sm font-serif leading-tight sm:text-base lg:text-lg">
                                {t('curatorNoteText')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: The Essence */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-6 lg:col-span-5 lg:space-y-10"
                >
                    <div className="space-y-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <h1 className="text-3xl font-serif leading-tight text-foreground sm:text-4xl md:text-6xl">
                                {product.name}
                            </h1>
                            {manufacturer && (
                                <Badge variant="outline" className="rounded-full px-4 py-1 glass border-none text-xs font-medium">
                                    {manufacturer.name}
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground sm:gap-4">
                            <span className="flex items-center gap-1 text-sm">
                                <Tag className="h-3 w-3" />
                                {t('sku')}: {product.sku}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span className="text-sm">#{product.id}</span>
                        </div>

                        <div className="text-3xl font-serif font-bold text-primary sm:text-4xl md:text-5xl">
                            {tCommon('currency')} {parseFloat(product.price).toFixed(2)}
                        </div>
                    </div>

                    <div className="space-y-6 rounded-2xl border border-white/20 bg-surface-container-low/50 p-4 backdrop-blur-sm sm:p-6 lg:space-y-8 lg:rounded-[3rem] lg:p-8">
                        <div>
                            <h3 className="text-xl font-serif mb-6 flex items-center gap-3">
                                <Layers className="h-5 w-5 text-primary" />
                                {t('specifications')}
                            </h3>
                            {product.specs && Object.keys(product.specs).length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key} className="flex flex-col gap-1 border-b border-surface-container-low py-3 sm:flex-row sm:items-center sm:justify-between">
                                            <span className="text-muted-foreground capitalize text-sm">
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <span className="font-medium text-sm">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm italic">{t('noSpecifications')}</p>
                            )}
                        </div>

                        <div className="pt-6">
                            <Button
                                className="h-14 w-full rounded-full text-base transition-all duration-300 hover:scale-[1.01] active:scale-95 sm:h-16 sm:text-lg"
                                disabled={isAdding || product.isPurchasable === false}
                                variant={product.isPurchasable === false ? "secondary" : "default"}
                                onClick={() => addToCart(product.id)}
                            >
                                {isAdding ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{t('adding')}</span>
                                    </div>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5 me-3" />
                                        {product.isPurchasable === false ? tProducts('unavailable') : tProducts('addToCart')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        <div className="rounded-2xl bg-surface-container-low/30 p-4 text-center sm:rounded-3xl sm:p-6">
                            <p className="text-xs text-muted-foreground mb-1">{t('category')}</p>
                            <p className="font-medium text-sm">{product.category.name}</p>
                        </div>
                        <div className="rounded-2xl bg-surface-container-low/30 p-4 text-center sm:rounded-3xl sm:p-6">
                            <p className="text-xs text-muted-foreground mb-1">{t('productType')}</p>
                            <p className="font-medium text-sm">{product.productType.name}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
