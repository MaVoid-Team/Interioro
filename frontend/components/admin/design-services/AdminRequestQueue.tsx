"use client"

import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AdminRequestRecord,
    QueueStatus,
    QueueType,
    useAdminRequestQueue,
} from "@/hooks/useAdminRequestQueue"

interface QueueLabels {
    summary: string
    status: string
    notes: string
    loading: string
    save: string
    saving: string
    createdAt: string
    searchPlaceholder: string
    allStatuses: string
    new: string
    contacted: string
    closed: string
    emptyTitle: string
    emptyDescription: string
    detailTitle: string
    detailDescription: string
    images: string
    noImages: string
    saveSuccess: string
    saveError: string
    previous: string
    next: string
}

interface AdminRequestQueueProps {
    queueType: QueueType
    title: string
    description: string
    icon: LucideIcon
    labels: QueueLabels
    getSummaryValue: (record: AdminRequestRecord) => string
    renderDetails: (record: AdminRequestRecord) => React.ReactNode
}

const statusClassMap: Record<QueueStatus, "secondary" | "default" | "outline"> = {
    new: "secondary",
    contacted: "default",
    closed: "outline",
}

export function AdminRequestQueue({
    queueType,
    title,
    description,
    icon: Icon,
    labels,
    getSummaryValue,
    renderDetails,
}: AdminRequestQueueProps) {
    const { records, isLoading, fetchQueue, fetchRecord, updateRecord } = useAdminRequestQueue(queueType)
    const [selectedRecord, setSelectedRecord] = useState<AdminRequestRecord | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [internalNotes, setInternalNotes] = useState("")
    const [status, setStatus] = useState<QueueStatus>("new")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        void (async () => {
            const result = await fetchQueue(currentPage, 12, search, statusFilter)
            setTotalPages(result?.meta.totalPages || 1)
        })()
    }, [currentPage, search, statusFilter, fetchQueue])

    const openDetail = async (id: number) => {
        const record = await fetchRecord(id)
        if (!record) return
        setSelectedRecord(record)
        setInternalNotes(record.internalNotes || "")
        setStatus(record.status)
        setDetailOpen(true)
    }

    const saveChanges = async () => {
        if (!selectedRecord) return

        setIsSaving(true)
        const updated = await updateRecord(selectedRecord.id, {
            status,
            internalNotes,
        })
        setIsSaving(false)

        if (!updated) {
            toast.error(labels.saveError)
            return
        }

        toast.success(labels.saveSuccess)
        setSelectedRecord(updated)
        setInternalNotes(updated.internalNotes || "")
        setStatus(updated.status)
        await fetchQueue(currentPage, 12, search, statusFilter)
    }

    const getStatusLabel = (value: QueueStatus) => {
        if (value === "new") return labels.new
        if (value === "contacted") return labels.contacted
        return labels.closed
    }

    return (
        <div className="space-y-6 bg-background">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px] lg:w-[520px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => {
                                setCurrentPage(1)
                                setSearch(event.target.value)
                            }}
                            placeholder={labels.searchPlaceholder}
                            className="ps-9"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                            setCurrentPage(1)
                            setStatusFilter(value)
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={labels.allStatuses} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{labels.allStatuses}</SelectItem>
                            <SelectItem value="new">{labels.new}</SelectItem>
                            <SelectItem value="contacted">{labels.contacted}</SelectItem>
                            <SelectItem value="closed">{labels.closed}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-3xl border bg-card">
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">{title}</p>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                </div>

                {records.length > 0 ? (
                    <div className="px-4 py-4 sm:px-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{labels.createdAt}</TableHead>
                                    <TableHead>{labels.summary}</TableHead>
                                    <TableHead>{labels.status}</TableHead>
                                    <TableHead>{labels.notes}</TableHead>
                                    <TableHead className="text-end"> </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="max-w-[320px]">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{record.fullName}</span>
                                                <span className="truncate text-sm text-muted-foreground">
                                                    {getSummaryValue(record)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusClassMap[record.status]}>
                                                {getStatusLabel(record.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[240px] truncate text-muted-foreground">
                                            {record.internalNotes || "—"}
                                        </TableCell>
                                        <TableCell className="text-end">
                                            <Button variant="outline" size="sm" onClick={() => void openDetail(record.id)}>
                                                {labels.detailTitle}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-4 flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            >
                                {labels.previous}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            >
                                {labels.next}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                        <Icon className="h-12 w-12 text-muted-foreground/50" />
                        <h2 className="text-lg font-semibold">{isLoading ? labels.loading : labels.emptyTitle}</h2>
                        <p className="max-w-md text-sm text-muted-foreground">{labels.emptyDescription}</p>
                    </div>
                )}
            </div>

            <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>{labels.detailTitle}</SheetTitle>
                        <SheetDescription>{labels.detailDescription}</SheetDescription>
                    </SheetHeader>

                    {selectedRecord && (
                        <div className="flex flex-col gap-6 p-4">
                            <div className="rounded-2xl border bg-muted/20 p-4">
                                <h3 className="font-medium">{selectedRecord.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{selectedRecord.email}</p>
                                <p className="text-sm text-muted-foreground">{selectedRecord.phone}</p>
                            </div>

                            <div className="space-y-3">
                                {renderDetails(selectedRecord)}
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-medium">{labels.images}</h3>
                                {selectedRecord.inspirationImages?.length ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedRecord.inspirationImages.map((image, index) => (
                                            <a
                                                key={`${image.publicId}-${index}`}
                                                href={image.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="overflow-hidden rounded-2xl border"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt=""
                                                    className="aspect-square w-full object-cover"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">{labels.noImages}</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">{labels.status}</label>
                                <Select value={status} onValueChange={(value) => setStatus(value as QueueStatus)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">{labels.new}</SelectItem>
                                        <SelectItem value="contacted">{labels.contacted}</SelectItem>
                                        <SelectItem value="closed">{labels.closed}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">{labels.notes}</label>
                                <Textarea
                                    value={internalNotes}
                                    onChange={(event) => setInternalNotes(event.target.value)}
                                    rows={6}
                                />
                            </div>

                            <Button onClick={() => void saveChanges()} disabled={isSaving}>
                                {isSaving ? labels.saving : labels.save}
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
