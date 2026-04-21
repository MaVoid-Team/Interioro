"use client"

import { PencilRuler } from "lucide-react"
import { useLocale } from "next-intl"
import { AdminRequestQueue } from "@/components/admin/design-services/AdminRequestQueue"
import { getDesignServicesContent } from "@/lib/designServicesContent"

export default function AdminCustomRequestsPage() {
    const locale = useLocale()
    const copy = getDesignServicesContent(locale)

    return (
        <AdminRequestQueue
            queueType="custom"
            title={copy.admin.custom.title}
            description={copy.admin.custom.description}
            icon={PencilRuler}
            labels={{
                ...copy.admin.queue,
                summary: copy.admin.custom.summary,
                searchPlaceholder: copy.admin.custom.searchPlaceholder,
                emptyTitle: copy.admin.custom.emptyTitle,
                emptyDescription: copy.admin.custom.emptyDescription,
            }}
            getSummaryValue={(record) => record.projectTypeOrSpace || record.visionDescription || "—"}
            renderDetails={(record) => (
                <>
                    <div className="rounded-2xl border p-4">
                        <p className="text-sm text-muted-foreground">{copy.custom.fields.projectTypeOrSpace}</p>
                        <p className="font-medium">{record.projectTypeOrSpace || "—"}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                        <p className="text-sm text-muted-foreground">{copy.custom.fields.visionDescription}</p>
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
                    <div className="rounded-2xl border p-4">
                        <p className="text-sm text-muted-foreground">{copy.custom.fields.stylePreferences}</p>
                        <p className="whitespace-pre-line text-sm leading-6">{record.stylePreferences || "—"}</p>
                    </div>
                </>
            )}
        />
    )
}
