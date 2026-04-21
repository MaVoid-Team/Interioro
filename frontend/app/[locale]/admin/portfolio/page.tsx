"use client"

import { useEffect, useMemo, useState } from "react"
import { Images, Pencil, Plus, Trash2 } from "lucide-react"
import { useLocale } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { usePortfolio, type PortfolioProject } from "@/hooks/usePortfolio"
import { getDesignServicesContent, getLocalizedPortfolioField } from "@/lib/designServicesContent"

type FormState = {
    slug: string
    titleEn: string
    titleAr: string
    summaryEn: string
    summaryAr: string
    descriptionEn: string
    descriptionAr: string
    sortOrder: string
    active: boolean
    coverImage: File | null
    removeCoverImage: boolean
    galleryImages: File[]
    removedGalleryImageIds: number[]
}

const initialFormState: FormState = {
    slug: "",
    titleEn: "",
    titleAr: "",
    summaryEn: "",
    summaryAr: "",
    descriptionEn: "",
    descriptionAr: "",
    sortOrder: "0",
    active: true,
    coverImage: null,
    removeCoverImage: false,
    galleryImages: [],
    removedGalleryImageIds: [],
}

export default function AdminPortfolioPage() {
    const locale = useLocale()
    const copy = getDesignServicesContent(locale)
    const { projects, fetchAdminProjects, saveProject, deleteProject, isLoading } = usePortfolio()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
    const [search, setSearch] = useState("")
    const [form, setForm] = useState<FormState>(initialFormState)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        void (async () => {
            const result = await fetchAdminProjects(currentPage, 12, search)
            setTotalPages(result?.meta.totalPages || 1)
        })()
    }, [currentPage, search, fetchAdminProjects])

    const visibleGallery = useMemo(() => {
        return (editingProject?.galleryImages || []).filter(
            (image) => !form.removedGalleryImageIds.includes(image.id)
        )
    }, [editingProject, form.removedGalleryImageIds])

    const openCreate = () => {
        setEditingProject(null)
        setForm(initialFormState)
        setDialogOpen(true)
    }

    const openEdit = (project: PortfolioProject) => {
        setEditingProject(project)
        setForm({
            slug: project.slug,
            titleEn: project.titleEn,
            titleAr: project.titleAr,
            summaryEn: project.summaryEn,
            summaryAr: project.summaryAr,
            descriptionEn: project.descriptionEn,
            descriptionAr: project.descriptionAr,
            sortOrder: String(project.sortOrder),
            active: project.active,
            coverImage: null,
            removeCoverImage: false,
            galleryImages: [],
            removedGalleryImageIds: [],
        })
        setDialogOpen(true)
    }

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSaving(true)

        const formData = new FormData()
        formData.append("slug", form.slug)
        formData.append("titleEn", form.titleEn)
        formData.append("titleAr", form.titleAr)
        formData.append("summaryEn", form.summaryEn)
        formData.append("summaryAr", form.summaryAr)
        formData.append("descriptionEn", form.descriptionEn)
        formData.append("descriptionAr", form.descriptionAr)
        formData.append("sortOrder", form.sortOrder)
        formData.append("active", String(form.active))
        formData.append("removeCoverImage", String(form.removeCoverImage))
        formData.append(
            "existingGallery",
            JSON.stringify(
                visibleGallery.map((image, index) => ({
                    id: image.id,
                    altEn: image.altEn,
                    altAr: image.altAr,
                    sortOrder: index,
                }))
            )
        )
        formData.append(
            "removeGalleryImageIds",
            JSON.stringify(form.removedGalleryImageIds)
        )

        if (form.coverImage) {
            formData.append("coverImage", form.coverImage)
        }

        form.galleryImages.forEach((file) => formData.append("galleryImages", file))

        const saved = await saveProject(formData, editingProject?.id)
        setIsSaving(false)

        if (!saved) {
            toast.error(copy.admin.portfolio.saveError)
            return
        }

        toast.success(copy.admin.portfolio.saveSuccess)
        setDialogOpen(false)
        setEditingProject(null)
        setForm(initialFormState)
        await fetchAdminProjects(currentPage, 12, search)
    }

    const removeProject = async (id: number) => {
        const success = await deleteProject(id)
        if (!success) {
            toast.error(copy.admin.portfolio.deleteError)
            return
        }

        toast.success(copy.admin.portfolio.deleteSuccess)
        await fetchAdminProjects(currentPage, 12, search)
    }

    return (
        <div className="space-y-6 bg-background">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{copy.admin.portfolio.title}</h1>
                    <p className="text-sm text-muted-foreground">{copy.admin.portfolio.description}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                        placeholder={copy.admin.portfolio.searchPlaceholder}
                        value={search}
                        onChange={(event) => {
                            setCurrentPage(1)
                            setSearch(event.target.value)
                        }}
                        className="sm:w-72"
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        {copy.admin.portfolio.create}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
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

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Images className="h-4 w-4" />
                                {(project.galleryImages?.length || 0)} {copy.detail.gallery}
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEdit(project)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {copy.admin.portfolio.edit}
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => void removeProject(project.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {copy.admin.portfolio.delete}
                                </Button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
                    {copy.admin.queue.previous}
                </Button>
                <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages || isLoading} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>
                    {copy.admin.queue.next}
                </Button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProject ? copy.admin.portfolio.edit : copy.admin.portfolio.create}
                        </DialogTitle>
                        <DialogDescription>{copy.admin.portfolio.description}</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input placeholder={copy.admin.portfolio.fields.slug} value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
                            <Input placeholder={copy.admin.portfolio.fields.sortOrder} value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: event.target.value }))} />
                            <Input placeholder={copy.admin.portfolio.fields.titleEn} value={form.titleEn} onChange={(event) => setForm((current) => ({ ...current, titleEn: event.target.value }))} required />
                            <Input placeholder={copy.admin.portfolio.fields.titleAr} value={form.titleAr} onChange={(event) => setForm((current) => ({ ...current, titleAr: event.target.value }))} required />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Textarea placeholder={copy.admin.portfolio.fields.summaryEn} rows={4} value={form.summaryEn} onChange={(event) => setForm((current) => ({ ...current, summaryEn: event.target.value }))} required />
                            <Textarea placeholder={copy.admin.portfolio.fields.summaryAr} rows={4} value={form.summaryAr} onChange={(event) => setForm((current) => ({ ...current, summaryAr: event.target.value }))} required />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Textarea placeholder={copy.admin.portfolio.fields.descriptionEn} rows={7} value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} required />
                            <Textarea placeholder={copy.admin.portfolio.fields.descriptionAr} rows={7} value={form.descriptionAr} onChange={(event) => setForm((current) => ({ ...current, descriptionAr: event.target.value }))} required />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-3">
                                <label className="text-sm font-medium">{copy.admin.portfolio.fields.coverImage}</label>
                                <Input type="file" accept="image/*" onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.files?.[0] || null }))} />
                                {editingProject?.coverImageUrl && !form.removeCoverImage && (
                                    <div className="space-y-2">
                                        <img src={editingProject.coverImageUrl} alt="" className="h-40 w-full rounded-2xl object-cover" />
                                        <Button type="button" variant="outline" size="sm" onClick={() => setForm((current) => ({ ...current, removeCoverImage: true }))}>
                                            {copy.admin.portfolio.delete}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">{copy.admin.portfolio.fields.galleryImages}</label>
                                <Input type="file" accept="image/*" multiple onChange={(event) => setForm((current) => ({ ...current, galleryImages: Array.from(event.target.files || []) }))} />
                                {visibleGallery.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {visibleGallery.map((image) => (
                                            <div key={image.id} className="space-y-2">
                                                <img src={image.imageUrl} alt="" className="aspect-square w-full rounded-2xl object-cover" />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() =>
                                                        setForm((current) => ({
                                                            ...current,
                                                            removedGalleryImageIds: [...current.removedGalleryImageIds, image.id],
                                                        }))
                                                    }
                                                >
                                                    {copy.admin.portfolio.delete}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border px-4 py-3">
                            <span className="text-sm font-medium">{copy.admin.portfolio.fields.active}</span>
                            <Switch checked={form.active} onCheckedChange={(checked) => setForm((current) => ({ ...current, active: checked }))} />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? copy.admin.queue.saving : copy.admin.queue.save}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
