"use client"

import { useCallback, useState } from "react"
import { useAuth } from "@/context/AuthContext"

export type QueueStatus = "new" | "contacted" | "closed"
export type QueueType = "custom" | "special-piece" | "consultation"

export interface RequestImage {
    url: string
    publicId: string
    originalName?: string
}

export interface AdminRequestRecord {
    id: number
    fullName: string
    email: string
    phone: string
    status: QueueStatus
    internalNotes: string | null
    inspirationImages: RequestImage[]
    createdAt: string
    updatedAt: string
    projectTypeOrSpace?: string
    visionDescription?: string
    stylePreferences?: string | null
    dimensions?: string | null
    budget?: string | null
    timeline?: string | null
    desiredPieceType?: string
    preferredContactMethod?: string
    questionSummary?: string
    preferredDays?: string | null
    preferredTimeWindow?: string | null
}

export interface QueueResponse {
    data: AdminRequestRecord[]
    meta: {
        totalItems: number
        itemsPerPage: number
        totalPages: number
        currentPage: number
    }
}

const queuePathMap: Record<QueueType, string> = {
    custom: "custom-design-requests",
    "special-piece": "special-piece-requests",
    consultation: "consultation-requests",
}

export function useAdminRequestQueue(type: QueueType) {
    const { token } = useAuth()
    const [records, setRecords] = useState<AdminRequestRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchQueue = useCallback(async (page: number = 1, limit: number = 12, search: string = "", status: string = "all") => {
        if (!token) return null

        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            })

            if (search) params.append("search", search)
            if (status && status !== "all") params.append("status", status)

            const response = await fetch(`/api/admin/${queuePathMap[type]}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            })

            if (!response.ok) {
                throw new Error("Failed to fetch queue")
            }

            const data: QueueResponse = await response.json()
            setRecords(data.data)
            return data
        } catch (err) {
            console.error("Failed to fetch request queue:", err)
            setError("Failed to fetch request queue")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [token, type])

    const fetchRecord = useCallback(async (id: number) => {
        if (!token) return null

        const response = await fetch(`/api/admin/${queuePathMap[type]}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        })

        if (!response.ok) return null
        return (await response.json()) as AdminRequestRecord
    }, [token, type])

    const updateRecord = useCallback(async (id: number, updates: { status?: QueueStatus; internalNotes?: string | null }) => {
        if (!token) return null

        const response = await fetch(`/api/admin/${queuePathMap[type]}/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        })

        if (!response.ok) return null
        return (await response.json()) as AdminRequestRecord
    }, [token, type])

    return {
        records,
        isLoading,
        error,
        fetchQueue,
        fetchRecord,
        updateRecord,
    }
}
