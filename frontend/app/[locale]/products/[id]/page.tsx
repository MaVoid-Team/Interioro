"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useCart } from "@/context/CartContext"
import { useManufacturers } from "@/hooks/useManufacturers"
import { useProducts } from "@/hooks/useProducts"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, ArrowLeft, Package, Tag, Layers } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

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
        <div className="min-h-screen bg-surface py-12 px-4 md:px-28 max-w-screen-3xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-12"
            >
                <Button variant="ghost" onClick={() => router.back()} className="rounded-full px-6 glass hover:bg-surface-container-low transition-all">
                    <ArrowLeft className="h-4 w-4 me-2" />
                    {t('back')}
                </Button>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: The Visual Focus */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-7"
                >
                    <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden bg-surface-container-low shadow-2xl group">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                unoptimized
                                className="object-cover p-4 transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Package className="h-32 w-32 text-muted-foreground/20" />
                            </div>
                        )}
                        <div className="absolute bottom-8 left-8 right-8 p-6 glass backdrop-blur-md rounded-3xl text-white/90 pointer-events-none">
                            <p className="text-sm font-medium italic opacity-80 mb-1">Curator&apos;s Note</p>
                            <p className="text-lg font-serif leading-tight">
                                A timeless addition to any curated space, blending organic form with refined function.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: The Essence */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:col-span-5 space-y-10"
                >
                    <div className="space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-4xl md:text-6xl font-serif text-foreground tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            {manufacturer && (
                                <Badge variant="outline" className="rounded-full px-4 py-1 glass border-none text-xs font-medium">
                                    {manufacturer.name}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground">
                            <span className="flex items-center gap-1 text-sm">
                                <Tag className="h-3 w-3" />
                                {t('sku')}: {product.sku}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span className="text-sm">#{product.id}</span>
                        </div>

                        <div className="text-4xl md:text-5xl font-serif text-primary font-bold">
                            {tProducts('currency')} {parseFloat(product.price).toFixed(2)}
                        </div>
                    </div>

                    <div className="space-y-8 p-8 rounded-[3rem] bg-surface-container-low/50 backdrop-blur-sm border border-white/20">
                        <div>
                            <h3 className="text-xl font-serif mb-6 flex items-center gap-3">
                                <Layers className="h-5 w-5 text-primary" />
                                {t('specifications')}
                            </h3>
                            {product.specs && Object.keys(product.specs).length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center py-3 border-b border-surface-container-low">
                                            <span className="text-muted-foreground capitalize text-sm">
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <span className="font-medium text-sm">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm italic">No technical specifications available for this piece.</p>
                            )}
                        </div>

                        <div className="pt-6">
                            <Button
                                className="w-full h-16 text-lg rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95"
                                disabled={isAdding || product.isPurchasable === false}
                                variant={product.isPurchasable === false ? "secondary" : "default"}
                                onClick={() => addToCart(product.id)}
                            >
                                {isAdding ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Adding...</span>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-surface-container-low/30 text-center">
                            <p className="text-xs text-muted-foreground mb-1">{t('category')}</p>
                            <p className="font-medium text-sm">{product.category.name}</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-surface-container-low/30 text-center">
                            <p className="text-xs text-muted-foreground mb-1">{t('productType')}</p>
                            <p className="font-medium text-sm">{product.productType.name}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
