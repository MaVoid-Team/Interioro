"use client"

import { Gem } from "lucide-react"
import { useLocale } from "next-intl"
import { AdminRequestQueue } from "@/components/admin/design-services/AdminRequestQueue"
import { getDesignServicesContent } from "@/lib/designServicesContent"

export default function AdminSpecialPiecesPage() {
    const locale = useLocale()
    const copy = getDesignServicesContent(locale)

    return (
        <AdminRequestQueue
            queueType="special-piece"
            title={copy.admin.special.title}
            description={copy.admin.special.description}
            icon={Gem}
            labels={{
                ...copy.admin.queue,
                summary: copy.admin.special.summary,
                searchPlaceholder: copy.admin.special.searchPlaceholder,
                emptyTitle: copy.admin.special.emptyTitle,
                emptyDescription: copy.admin.special.emptyDescription,
            }}
            getSummaryValue={(record) => record.desiredPieceType || record.visionDescription || "—"}
            renderDetails={(record) => (
                <>
                    <div className="rounded-2xl border p-4">
                        <p className="text-sm text-muted-foreground">{copy.portfolio.specialFields.desiredPieceType}</p>
                        <p className="font-medium">{record.desiredPieceType || "—"}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                        <p className="text-sm text-muted-foreground">{copy.portfolio.specialFields.visionDescription}</p>
                        <p className="whitespace-pre-line text-sm leading-6">{record.visionDescription || "—"}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border p-4">
                            <p className="text-sm text-muted-foreground">{copy.shared.dimensions}</p>
                            <p className="font-medium">{record.dimensions || "—"}</p>
                        </div>
                        <div className="rounded-2xl border p-4">
                            <p className="text-sm text-muted-foreground">{copy.shared.budget}</p>
                            <p className="font-medium">{record.budget || "—"}</p>
                        </div>
                        <div className="rounded-2xl border p-4">
                            <p className="text-sm text-muted-foreground">{copy.shared.timeline}</p>
                            <p className="font-medium">{record.timeline || "—"}</p>
                        </div>
                    </div>
                </>
            )}
        />
    )
}
