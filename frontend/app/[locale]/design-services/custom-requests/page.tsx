"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useLocale } from "next-intl"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getDesignServicesContent } from "@/lib/designServicesContent"

export default function CustomRequestsPage() {
    const locale = useLocale()
    const copy = getDesignServicesContent(locale)
    const { token } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        projectTypeOrSpace: "",
        visionDescription: "",
        stylePreferences: "",
        dimensions: "",
        budget: "",
        timeline: "",
        inspirationImages: [] as File[],
    })
    const textFieldKeys = [
        "fullName",
        "email",
        "phone",
        "projectTypeOrSpace",
        "visionDescription",
        "stylePreferences",
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

        const response = await fetch("/api/design-services/custom-requests", {
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
            projectTypeOrSpace: "",
            visionDescription: "",
            stylePreferences: "",
            dimensions: "",
            budget: "",
            timeline: "",
            inspirationImages: [],
        })
    }

    return (
        <div className="min-h-screen bg-background pt-24">
            <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
                <section className="space-y-5 lg:sticky lg:top-28 lg:self-start">
                    <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary">
                        {copy.navLabel}
                    </span>
                    <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{copy.custom.title}</h1>
                    <p className="max-w-xl text-base leading-7 text-muted-foreground">
                        {copy.custom.description}
                    </p>
                </section>

                <form onSubmit={submit} className="space-y-5 rounded-[2rem] border bg-card p-6 sm:p-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input placeholder={copy.shared.fullName} value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} required />
                        <Input type="email" placeholder={copy.shared.email} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
                        <Input placeholder={copy.shared.phone} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} required />
                        <Input placeholder={copy.custom.fields.projectTypeOrSpace} value={form.projectTypeOrSpace} onChange={(event) => setForm((current) => ({ ...current, projectTypeOrSpace: event.target.value }))} required />
                    </div>

                    <Textarea placeholder={copy.custom.fields.visionDescription} rows={6} value={form.visionDescription} onChange={(event) => setForm((current) => ({ ...current, visionDescription: event.target.value }))} required />
                    <Textarea placeholder={copy.custom.fields.stylePreferences} rows={4} value={form.stylePreferences} onChange={(event) => setForm((current) => ({ ...current, stylePreferences: event.target.value }))} />

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
        </div>
    )
}
