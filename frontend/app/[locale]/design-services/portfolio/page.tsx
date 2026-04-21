"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"
import { useAuth } from "@/context/AuthContext"
import { usePortfolio } from "@/hooks/usePortfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getDesignServicesContent, getLocalizedPortfolioField } from "@/lib/designServicesContent"

export default function PortfolioPage() {
    const locale = useLocale()
    const copy = getDesignServicesContent(locale)
    const { token } = useAuth()
    const { projects, isLoading } = usePortfolio()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        desiredPieceType: "",
        visionDescription: "",
        dimensions: "",
        budget: "",
        timeline: "",
        inspirationImages: [] as File[],
    })
    const textFieldKeys = [
        "fullName",
        "email",
        "phone",
        "desiredPieceType",
        "visionDescription",
        "dimensions",
        "budget",
        "timeline",
    ] as const

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData()
        textFieldKeys.forEach((key) => {
            const value = form[key]
            if (value) formData.append(key, value)
        })
        form.inspirationImages.forEach((file) => formData.append("inspirationImages", file))

        const response = await fetch("/api/design-services/special-piece-requests", {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: formData,
        })

        setIsSubmitting(false)

        if (!response.ok) {
            toast.error(copy.shared.error)
            return
        }

        toast.success(copy.shared.success)
        setForm({
            fullName: "",
            email: "",
            phone: "",
            desiredPieceType: "",
            visionDescription: "",
            dimensions: "",
            budget: "",
            timeline: "",
            inspirationImages: [],
        })
    }

    return (
        <div className="min-h-screen bg-background pt-24">
            <section className="px-4 pb-12 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-screen-2xl space-y-4">
                    <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary">
                        {copy.navLabel}
                    </span>
                    <h1 className="max-w-4xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                        {copy.portfolio.title}
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                        {copy.portfolio.description}
                    </p>
                </div>
            </section>

            <section className="px-4 pb-16 sm:px-6 lg:px-10">
                <div className="mx-auto grid max-w-screen-2xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="grid gap-6 md:grid-cols-2">
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <article key={project.id} className="overflow-hidden rounded-[2rem] border bg-card">
                                    <div className="aspect-[4/3] bg-muted/30">
                                        {project.coverImageUrl ? (
                                            <img
                                                src={project.coverImageUrl}
                                                alt={getLocalizedPortfolioField(project, locale, "title")}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="space-y-4 p-6">
                                        <div className="space-y-2">
                                            <h2 className="font-serif text-2xl">
                                                {getLocalizedPortfolioField(project, locale, "title")}
                                            </h2>
                                            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                                                {getLocalizedPortfolioField(project, locale, "summary")}
                                            </p>
                                        </div>
                                        <Link href={`/design-services/portfolio/${project.slug}`}>
                                            <Button variant="outline" className="rounded-full">
                                                {copy.portfolio.viewProject}
                                            </Button>
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="rounded-[2rem] border border-dashed bg-card/60 p-8 text-muted-foreground md:col-span-2">
                                {isLoading ? "Loading..." : copy.portfolio.empty}
                            </div>
                        )}
                    </div>

                    <form onSubmit={submit} className="space-y-5 rounded-[2rem] border bg-card p-6 sm:p-8 lg:sticky lg:top-28 lg:self-start">
                        <div className="space-y-3">
                            <h2 className="font-serif text-3xl">{copy.portfolio.specialTitle}</h2>
                            <p className="text-sm leading-6 text-muted-foreground">
                                {copy.portfolio.specialDescription}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input placeholder={copy.shared.fullName} value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} required />
                            <Input type="email" placeholder={copy.shared.email} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
                            <Input placeholder={copy.shared.phone} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} required />
                            <Input placeholder={copy.portfolio.specialFields.desiredPieceType} value={form.desiredPieceType} onChange={(event) => setForm((current) => ({ ...current, desiredPieceType: event.target.value }))} required />
                        </div>

                        <Textarea placeholder={copy.portfolio.specialFields.visionDescription} rows={6} value={form.visionDescription} onChange={(event) => setForm((current) => ({ ...current, visionDescription: event.target.value }))} required />

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Input placeholder={copy.shared.dimensions} value={form.dimensions} onChange={(event) => setForm((current) => ({ ...current, dimensions: event.target.value }))} />
                            <Input placeholder={copy.shared.budget} value={form.budget} onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))} />
                            <Input placeholder={copy.shared.timeline} value={form.timeline} onChange={(event) => setForm((current) => ({ ...current, timeline: event.target.value }))} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{copy.shared.upload}</label>
                            <Input type="file" accept="image/*" multiple onChange={(event) => setForm((current) => ({ ...current, inspirationImages: Array.from(event.target.files || []) }))} />
                            <p className="text-sm text-muted-foreground">{copy.shared.uploadHint}</p>
                        </div>

                        <Button type="submit" size="lg" className="rounded-full" disabled={isSubmitting}>
                            {isSubmitting ? copy.shared.submitting : copy.shared.submit}
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    )
}
