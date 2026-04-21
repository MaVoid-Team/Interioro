"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"

export interface PortfolioProjectImage {
    id: number
    projectId: number
    imageUrl: string
    imagePublicId: string
    altEn: string | null
    altAr: string | null
    sortOrder: number
}

export interface PortfolioProject {
    id: number
    slug: string
    titleEn: string
    titleAr: string
    summaryEn: string
    summaryAr: string
    descriptionEn: string
    descriptionAr: string
    coverImageUrl: string | null
    coverImagePublicId: string | null
    active: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
    galleryImages?: PortfolioProjectImage[]
}

export interface PortfolioListResponse {
    data: PortfolioProject[]
    meta: {
        totalItems: number
        itemsPerPage: number
        totalPages: number
        currentPage: number
    }
}

export function usePortfolio() {
    const { token } = useAuth()
    const [projects, setProjects] = useState<PortfolioProject[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchPublicProjects = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/design-services/portfolio", {
                cache: "no-store",
            })

            if (!response.ok) {
                throw new Error("Failed to fetch portfolio")
            }

            const data: PortfolioProject[] = await response.json()
            setProjects(data)
            return data
        } catch (err) {
            console.error("Failed to fetch portfolio projects:", err)
            setError("Failed to fetch portfolio projects")
            setProjects([])
            return []
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchProjectBySlug = useCallback(async (slug: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/design-services/portfolio/${slug}`, {
                cache: "no-store",
            })

            if (!response.ok) {
                return null
            }

            return (await response.json()) as PortfolioProject
        } catch (err) {
            console.error("Failed to fetch portfolio project:", err)
            setError("Failed to fetch portfolio project")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchAdminProjects = useCallback(async (page: number = 1, limit: number = 12, search: string = "") => {
        if (!token) return null

        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            })
            if (search) params.append("search", search)

            const response = await fetch(`/api/admin/portfolio?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            })

            if (!response.ok) {
                throw new Error("Failed to fetch admin portfolio")
            }

            const data: PortfolioListResponse = await response.json()
            setProjects(data.data)
            return data
        } catch (err) {
            console.error("Failed to fetch admin portfolio:", err)
            setError("Failed to fetch admin portfolio")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [token])

    const saveProject = useCallback(async (formData: FormData, id?: number) => {
        if (!token) return null

        const url = id ? `/api/admin/portfolio/${id}` : "/api/admin/portfolio"
        const method = id ? "PUT" : "POST"

        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if (!response.ok) {
            return null
        }

        return (await response.json()) as PortfolioProject
    }, [token])

    const deleteProject = useCallback(async (id: number) => {
        if (!token) return false

        const response = await fetch(`/api/admin/portfolio/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return response.ok || response.status === 204
    }, [token])

    useEffect(() => {
        void fetchPublicProjects()
    }, [fetchPublicProjects])

    return {
        projects,
        isLoading,
        error,
        fetchPublicProjects,
        fetchProjectBySlug,
        fetchAdminProjects,
        saveProject,
        deleteProject,
    }
}
