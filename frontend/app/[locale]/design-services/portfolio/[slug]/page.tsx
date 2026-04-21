"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { useParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { usePortfolio, type PortfolioProject } from "@/hooks/usePortfolio"
import { Button } from "@/components/ui/button"
import { getDesignServicesContent, getLocalizedPortfolioField } from "@/lib/designServicesContent"

export default function PortfolioProjectDetailPage() {
    const locale = useLocale()
    const params = useParams<{ slug: string }>()
    const copy = getDesignServicesContent(locale)
    const { fetchProjectBySlug } = usePortfolio()
    const [project, setProject] = useState<PortfolioProject | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        void (async () => {
            setIsLoading(true)
            const result = await fetchProjectBySlug(params.slug)
            setProject(result)
            setIsLoading(false)
        })()
    }, [fetchProjectBySlug, params.slug])

    if (isLoading) {
        return <div className="min-h-screen bg-background pt-32 text-center text-muted-foreground">Loading...</div>
    }

    if (!project) {
        return <div className="min-h-screen bg-background pt-32 text-center text-muted-foreground">Project not found.</div>
    }

    return (
        <div className="min-h-screen bg-background pt-24">
            <div className="mx-auto max-w-screen-2xl px-4 pb-16 sm:px-6 lg:px-10">
                <div className="space-y-6">
                    <Link href="/design-services/portfolio">
                        <Button variant="outline" className="rounded-full">
                            {copy.portfolio.backToPortfolio}
                        </Button>
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        <div className="overflow-hidden rounded-[2.5rem] border bg-card">
                            {project.coverImageUrl ? (
                                <img
                                    src={project.coverImageUrl}
                                    alt={getLocalizedPortfolioField(project, locale, "title")}
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            ) : null}
                        </div>

                        <div className="space-y-5">
                            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
                                {getLocalizedPortfolioField(project, locale, "title")}
                            </h1>
                            <p className="text-base leading-7 text-muted-foreground">
                                {getLocalizedPortfolioField(project, locale, "summary")}
                            </p>
                            <div className="rounded-[2rem] border bg-card p-6">
                                <p className="whitespace-pre-line text-sm leading-7 text-foreground/85">
                                    {getLocalizedPortfolioField(project, locale, "description")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {(project.galleryImages || []).length > 0 && (
                        <section className="space-y-4 pt-6">
                            <h2 className="font-serif text-3xl">{copy.detail.gallery}</h2>
                            <div className="grid gap-4 md:grid-cols-3">
                                {project.galleryImages?.map((image) => (
                                    <div key={image.id} className="overflow-hidden rounded-[2rem] border bg-card">
                                        <img
                                            src={image.imageUrl}
                                            alt={locale === "ar" ? image.altAr || "" : image.altEn || ""}
                                            className="aspect-square w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
