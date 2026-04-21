"use client"

import { CalendarRange } from "lucide-react"
import { useLocale } from "next-intl"
import { AdminRequestQueue } from "@/components/admin/design-services/AdminRequestQueue"
import { getDesignServicesContent } from "@/lib/designServicesContent"

export default function AdminConsultationsPage() {
    const locale = useLocale()
    const copy = getDesignServicesContent(locale)

    return (
        <AdminRequestQueue
            queueType="consultation"
            title={copy.admin.consultation.title}
            description={copy.admin.consultation.description}
            icon={CalendarRange}
            labels={{
                ...copy.admin.queue,
                summary: copy.admin.consultation.summary,
                searchPlaceholder: copy.admin.consultation.searchPlaceholder,
                emptyTitle: copy.admin.consultation.emptyTitle,
                emptyDescription: copy.admin.consultation.emptyDescription,
            }}
            getSummaryValue={(record) => record.questionSummary || "—"}
            renderDetails={(record) => (
                <>
                    <div className="rounded-2xl border p-4">
                        <p className="text-sm text-muted-foreground">{copy.consultation.fields.preferredContactMethod}</p>
                        <p className="font-medium">{record.preferredContactMethod || "—"}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                        <p className="text-sm text-muted-foreground">{copy.consultation.fields.questionSummary}</p>
                        <p className="whitespace-pre-line text-sm leading-6">{record.questionSummary || "—"}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border p-4">
                            <p className="text-sm text-muted-foreground">{copy.consultation.fields.preferredDays}</p>
                            <p className="font-medium">{record.preferredDays || "—"}</p>
                        </div>
                        <div className="rounded-2xl border p-4">
                            <p className="text-sm text-muted-foreground">{copy.consultation.fields.preferredTimeWindow}</p>
                            <p className="font-medium">{record.preferredTimeWindow || "—"}</p>
                        </div>
                    </div>
                </>
            )}
        />
    )
}
