"use client"

import { ArrowRight } from "lucide-react"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { getDesignServicesContent } from "@/lib/designServicesContent"

export default function DesignServicesHubPage() {
    const locale = useLocale()
    const copy = getDesignServicesContent(locale)

    return (
        <div className="min-h-screen bg-background pt-24">
            <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-10">
                <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_right,_rgba(0,66,58,0.18),_transparent_40%),radial-gradient(circle_at_top_left,_rgba(105,75,29,0.14),_transparent_35%)]" />
                <div className="relative mx-auto max-w-screen-2xl">
                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        <div className="space-y-6">
                            <span className="inline-flex rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-primary">
                                {copy.hub.eyebrow}
                            </span>
                            <div className="max-w-4xl space-y-4">
                                <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl lg:text-7xl">
                                    {copy.hub.title}
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    {copy.hub.description}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/design-services/portfolio">
                                    <Button size="lg" className="rounded-full">
                                        {copy.portfolio.title}
                                    </Button>
                                </Link>
                                <Link href="/design-services/custom-requests">
                                    <Button size="lg" variant="outline" className="rounded-full">
                                        {copy.custom.title}
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {copy.hub.cards.map((card, index) => (
                                <Link
                                    key={card.href}
                                    href={card.href as "/design-services/portfolio" | "/design-services/custom-requests" | "/design-services/consultation"}
                                    className="group rounded-[2rem] border border-border/70 bg-card/80 p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                0{index + 1}
                                            </p>
                                            <h2 className="font-serif text-2xl text-foreground">{card.title}</h2>
                                            <p className="text-sm leading-6 text-muted-foreground">{card.description}</p>
                                        </div>
                                        <ArrowRight className="mt-1 h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 pb-20 sm:px-6 lg:px-10">
                <div className="mx-auto grid max-w-screen-2xl gap-8 rounded-[2.5rem] bg-primary px-6 py-10 text-primary-foreground sm:px-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                        {copy.hub.sectionTitle}
                    </h2>
                    <p className="max-w-3xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
                        {copy.hub.sectionText}
                    </p>
                </div>
            </section>
        </div>
    )
}
