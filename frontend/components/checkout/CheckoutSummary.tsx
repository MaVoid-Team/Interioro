"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ShoppingCart, X, Tag, Loader2 } from "lucide-react"
import { Location } from "@/types/location"
import { CartData } from "@/context/CartContext"
import { ValidateDiscountResponse } from "@/hooks/useDiscounts"

interface CheckoutSummaryProps {
    cartData: CartData | null
    selectedLocation?: Location
    appliedDiscount?: ValidateDiscountResponse | null
    onApplyPromoCode?: (code: string, subtotal: number) => Promise<ValidateDiscountResponse | null>
    onRemovePromoCode?: () => void
    isValidatingPromo?: boolean
}

export function CheckoutSummary({
    cartData,
    selectedLocation,
    appliedDiscount,
    onApplyPromoCode,
    onRemovePromoCode,
    isValidatingPromo = false
}: CheckoutSummaryProps) {
    const t = useTranslations('Checkout')
    const tCommon = useTranslations('Common')
    const [promoCode, setPromoCode] = useState("")

    if (!cartData) return null

    const subtotal = cartData.totals.subtotal

    // Calculate shipping and tax from selected location if available
    let shipping = 0
    let tax = 0

    if (selectedLocation) {
        // Calculate shipping based on rate (rate is a decimal like 0.05 for 5%)
        const shippingRate = parseFloat(selectedLocation.shippingRate) || 0
        shipping = subtotal * shippingRate

        // Calculate tax based on rate
        const taxRate = parseFloat(selectedLocation.taxRate) || 0
        tax = subtotal * taxRate
    } else {
        // Use cart default values if no location selected
        shipping = cartData.totals.shipping || 0
        tax = cartData.totals.tax || 0
    }

    // Calculate discount amount
    const discountAmount = appliedDiscount?.discountAmount || 0

    // Calculate total with discount
    const total = subtotal + shipping + tax - discountAmount

    const handleApplyPromo = async () => {
        if (!promoCode.trim() || !onApplyPromoCode) return
        await onApplyPromoCode(promoCode.trim().toUpperCase(), subtotal)
    }

    const handleRemovePromo = () => {
        setPromoCode("")
        onRemovePromoCode?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleApplyPromo()
        }
    }

    return (
        <Card className="bg-card lg:sticky lg:top-4">
            <CardHeader className="p-4 sm:p-6">
                <CardTitle>{t('summary.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
                {/* Items */}
                <div className="space-y-3">
                    {cartData.items.map((item) => {
                        // Get display data based on item type
                        const displayItem = item.itemType === 'bundle' ? item.bundle : item.product
                        if (!displayItem) return null

                        return (
                            <div key={item.id} className="flex min-w-0 gap-3 text-sm sm:gap-4">
                                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border bg-background sm:h-16 sm:w-16">
                                    {displayItem.imageUrl ? (
                                        <Image
                                            src={displayItem.imageUrl}
                                            alt={displayItem.name}
                                            fill
                                            unoptimized
                                            className="object-contain p-1"
                                            sizes="64px"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-secondary">
                                            <ShoppingCart className="h-4 w-4 opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <span className="font-medium line-clamp-2">
                                        {displayItem.name}
                                    </span>
                                    <span className="text-muted-foreground mt-1">
                                        Qty: {item.quantity}
                                    </span>
                                </div>
                                <span className="flex shrink-0 items-center text-xs font-medium sm:text-sm">
                                    {tCommon('currency')} {(parseFloat(displayItem.price) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        )
                    })}
                </div>

                <Separator />

                {/* Promo Code Input */}
                {onApplyPromoCode && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            {t('summary.promoCode')}
                        </label>
                        {appliedDiscount?.valid ? (
                            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-primary" />
                                    <span className="font-mono font-semibold text-sm">
                                        {appliedDiscount.discountCode.code}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        (-{appliedDiscount.discountCode.type === 'percentage'
                                            ? `${appliedDiscount.discountCode.value}%`
                                            : `${tCommon('currency')} ${parseFloat(appliedDiscount.discountCode.value).toFixed(2)}`
                                        })
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemovePromo}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                    placeholder={t('summary.promoCodePlaceholder')}
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    onKeyDown={handleKeyDown}
                                    disabled={isValidatingPromo}
                                    className="font-mono"
                                />
                                <Button
                                    onClick={handleApplyPromo}
                                    disabled={!promoCode.trim() || isValidatingPromo}
                                    variant="secondary"
                                    className="shrink-0"
                                >
                                    {isValidatingPromo ? (
                                        <>
                                            <Loader2 className="h-4 w-4 me-2 animate-spin" />
                                            {t('summary.applying')}
                                        </>
                                    ) : (
                                        t('summary.apply')
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <Separator />

                {/* Subtotal */}
                <div className="flex justify-between gap-3 text-sm">
                    <span>{t('summary.subtotal')}</span>
                    <span>{tCommon('currency')} {subtotal.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between gap-3 text-sm">
                    <span className="flex items-center gap-1">
                        {t('summary.shipping')}
                        {selectedLocation && (
                            <span className="text-xs text-muted-foreground">
                                ({(parseFloat(selectedLocation.shippingRate) * 100).toFixed(0)}%)
                            </span>
                        )}
                    </span>
                    <span className={shipping === 0 ? "text-secondary" : ""}>
                        {shipping === 0 ? t('summary.free') : `${tCommon('currency')} ${shipping.toFixed(2)}`}
                    </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between gap-3 text-sm">
                    <span className="flex items-center gap-1">
                        {t('summary.tax')}
                        {selectedLocation && (
                            <span className="text-xs text-muted-foreground">
                                ({(parseFloat(selectedLocation.taxRate) * 100).toFixed(0)}%)
                            </span>
                        )}
                    </span>
                    <span>{tCommon('currency')} {tax.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {discountAmount > 0 && (
                    <div className="flex justify-between gap-3 text-sm text-primary">
                        <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {t('summary.discount')}
                        </span>
                        <span>-{tCommon('currency')} {discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between gap-3 text-base font-bold sm:text-lg">
                    <span>{t('summary.total')}</span>
                    <span>{tCommon('currency')} {total.toFixed(2)}</span>
                </div>

                {/* Location Info */}
                {selectedLocation && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                        Rates based on: {selectedLocation.name}, {selectedLocation.city}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
