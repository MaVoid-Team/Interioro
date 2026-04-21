"use client"

import { useTranslations } from "next-intl"

interface CheckoutStepsProps {
    currentStep: number
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
    const t = useTranslations('Checkout')

    const steps = [
        { number: 1, label: t('steps.shipping') },
        { number: 2, label: t('steps.review') },
    ]

    return (
        <div className="flex min-w-max items-center justify-center px-2">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div className="flex min-w-20 flex-col items-center">
                        <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors sm:h-10 sm:w-10 sm:text-base ${currentStep >= step.number
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-muted'
                                }`}
                        >
                            {step.number}
                        </div>
                        <span className={`mt-2 text-center text-xs sm:text-sm ${currentStep >= step.number ? 'text-primary font-medium' : 'text-muted-foreground'
                            }`}>
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`mx-1 h-0.5 w-8 transition-colors sm:mx-2 sm:w-16 md:w-24 ${currentStep > step.number ? 'bg-primary' : 'bg-muted'
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
