"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useDebounce } from "@/hooks/useDebounce"
import { useCategories } from "@/hooks/useCategories"
import { useManufacturers } from "@/hooks/useManufacturers"
import { Button } from "@/components/ui/button"
import { ProductSearchBar } from "@/components/products/ProductSearchBar"
import { ProductCard, Product } from "@/components/products/ProductCard"
import { CategoriesGrid } from "@/components/products/CategoriesGrid"
import {
    ProductFilters,
    ProductType,
    AllProductsPageSkeleton
} from "@/components/products/ProductFilters"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Filter, X } from "lucide-react"

const PRODUCTS_PER_PAGE = 6

interface AllProductsProps {
    /** Initial search query */
    initialSearch?: string
    /** Whether to show the integrated search bar */
    showSearch?: boolean
    /** Custom title for the page */
    title?: string
    /** Whether to show the title */
    showTitle?: boolean
    /** Initial manufacturer ID filter */
    initialManufacturerId?: number
    /** Initial product type ID filter */
    initialProductTypeId?: number
    /** Initial category ID filter */
    initialCategoryId?: number
}

export function AllProducts({
    initialSearch = '',
    showSearch = false,
    title,
    showTitle = true,
    initialManufacturerId,
    initialProductTypeId,
    initialCategoryId
}: AllProductsProps = {}) {
    const t = useTranslations('AllProducts')
    const tPage = useTranslations('ProductsPage')

    // Use hooks for categories and manufacturers
    const { categories, isLoading: loadingCategories } = useCategories()
    const { manufacturers, isLoading: loadingManufacturers } = useManufacturers()

    const [products, setProducts] = useState<Product[]>([])
    const [productTypes, setProductTypes] = useState<ProductType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Search state with debounce
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const debouncedSearch = useDebounce(searchQuery, 300)

    // Filter states - initialize with URL parameters if provided
    const [selectedManufacturers, setSelectedManufacturers] = useState<number[]>(
        initialManufacturerId ? [initialManufacturerId] : []
    )
    const [selectedProductTypes, setSelectedProductTypes] = useState<number[]>(
        initialProductTypeId ? [initialProductTypeId] : []
    )
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        initialCategoryId || null
    )
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
    const [showFilters, setShowFilters] = useState(false)
    const [inStockOnly, setInStockOnly] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Build query parameters for products
                const params = new URLSearchParams({
                    page: '1',
                    limit: '50',
                });

                if (debouncedSearch) params.append('search', debouncedSearch);
                if (selectedCategory) params.append('categoryId', selectedCategory.toString());
                selectedManufacturers.forEach(id => params.append('manufacturerId', id.toString()));
                selectedProductTypes.forEach(id => params.append('productTypeId', id.toString()));
                if (inStockOnly) params.append('in_stock', 'true');

                // Fetch products with filters
                const productsRes = await fetch(`/api/products?${params.toString()}`);
                const productsData = await productsRes.json();
                const fetchedProducts = productsData.data || [];
                setProducts(fetchedProducts);

                // Dynamically set price range based on actual product prices
                if (fetchedProducts.length > 0) {
                    const prices = fetchedProducts.map((p: Product) => parseFloat(p.price));
                    const minPrice = Math.floor(Math.min(...prices));
                    const maxPrice = Math.ceil(Math.max(...prices));

                    // Only update price range if it's at default values or if we need to expand it
                    setPriceRange(prev => {
                        // If current range is default or doesn't cover all products, update it
                        if (prev[0] === 0 && prev[1] === 5000) {
                            return [minPrice, maxPrice];
                        }
                        // Expand range if needed to include all products
                        return [
                            Math.min(prev[0], minPrice),
                            Math.max(prev[1], maxPrice)
                        ];
                    });
                }

                // Fetch product types on initial load (no hook available yet)
                if (productTypes.length === 0) {
                    const productTypesRes = await fetch('/api/productTypes');
                    const productTypesData = await productTypesRes.json();
                    setProductTypes(productTypesData.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [debouncedSearch, selectedCategory, selectedManufacturers, selectedProductTypes, inStockOnly]);

    const toggleManufacturer = (id: number) => {
        setSelectedManufacturers(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    const toggleProductType = (id: number) => {
        setSelectedProductTypes(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const clearFilters = () => {
        setSelectedManufacturers([])
        setSelectedProductTypes([])
        setSelectedCategory(null)
        setInStockOnly(false)
        setSearchQuery('')
        setCurrentPage(1)

        // Reset price range to show all products
        if (products.length > 0) {
            const prices = products.map(p => parseFloat(p.price));
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange([minPrice, maxPrice]);
        } else {
            setPriceRange([0, 5000]);
        }
    }

    // Client-side price range filtering only (other filters are server-side via API)
    const filteredProducts = products.filter(product => {
        const price = parseFloat(product.price)
        return price >= priceRange[0] && price <= priceRange[1]
    })

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    const endIndex = startIndex + PRODUCTS_PER_PAGE
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            if (currentPage > 3) {
                pages.push('...')
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (currentPage < totalPages - 2) {
                pages.push('...')
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages)
            }
        }

        return pages
    }

    if (isLoading) {
        return <AllProductsPageSkeleton />
    }

    const isCatalogPage = showSearch
    const visibleProducts = isCatalogPage ? paginatedProducts : filteredProducts.slice(0, 8)

    return (
        <section className="mx-auto max-w-screen-3xl bg-surface px-4 py-10 sm:py-12 md:px-8 lg:px-28 lg:py-16">
            {/* Editorial Header */}
            <div className="mb-8 flex flex-col gap-6 sm:mb-12 lg:gap-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {showTitle && (
                        <h1 className="text-3xl font-serif leading-tight text-foreground sm:text-4xl md:text-6xl">
                            {title || t('title')}
                        </h1>
                    )}
                    {isCatalogPage && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full rounded-full px-6 py-5 transition-all duration-300 sm:w-auto"
                        >
                            <Filter className="h-4 w-4 me-2" />
                            {showFilters ? t('hideFilters') : t('showFilters')}
                        </Button>
                    )}
                </div>

                {/* Search Bar as a Curator's Tool */}
                {showSearch && (
                    <div className="group relative max-w-2xl">
                        <ProductSearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            className="relative rounded-full glass border-none shadow-sm"
                        />
                    </div>
                )}

                {/* Active Filters as Curator's Tags */}
                {(searchQuery || selectedCategory || selectedManufacturers.length > 0 || selectedProductTypes.length > 0 || inStockOnly) && showSearch && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-sm font-medium text-muted-foreground italic">Curated by:</span>
                        {searchQuery && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setSearchQuery('')}
                                    className="rounded-full h-8 px-4 glass border-none text-xs hover:scale-105 transition-transform"
                                >
                                    &quot;{searchQuery}&quot;
                                    <X className="h-3 w-3 ms-2" />
                                </Button>

                        )}
                        {selectedCategory && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setSelectedCategory(null)}
                                className="rounded-full h-8 px-4 glass border-none text-xs hover:scale-105 transition-transform"
                            >
                                {categories.find(c => c.id === selectedCategory)?.name}
                                <X className="h-3 w-3 ms-2" />
                            </Button>
                        )}
                        {selectedManufacturers.map(id => (
                            <Button
                                key={id}
                                variant="secondary"
                                size="sm"
                                onClick={() => toggleManufacturer(id)}
                                className="rounded-full h-8 px-4 glass border-none text-xs hover:scale-105 transition-transform"
                            >
                                {manufacturers.find(m => m.id === id)?.name}
                                <X className="h-3 w-3 ms-2" />
                            </Button>
                        ))}
                        {selectedProductTypes.map(id => (
                            <Button
                                key={id}
                                variant="secondary"
                                size="sm"
                                onClick={() => toggleProductType(id)}
                                className="rounded-full h-8 px-4 glass border-none text-xs hover:scale-105 transition-transform"
                            >
                                {productTypes.find(p => p.id === id)?.name}
                                <X className="h-3 w-3 ms-2" />
                            </Button>
                        ))}
                        {inStockOnly && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setInStockOnly(false)}
                                className="rounded-full h-8 px-4 glass border-none text-xs hover:scale-105 transition-transform"
                            >
                                {t('inStockOnly')}
                                <X className="h-3 w-3 ms-2" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-full text-xs"
                        >
                            {tPage('clearAll')}
                        </Button>
                    </div>
                )}
            </div>

            {/* Categories as a Curator's Selection */}
            {isCatalogPage && (
            <div className="mb-8 sm:mb-12 lg:mb-16">
                <div className="mb-5 flex items-baseline gap-4 sm:mb-6">
                    <h2 className="text-xl font-serif text-foreground sm:text-2xl">{t('categories')}</h2>
                    <div className="h-px flex-1 bg-surface-container-low"></div>
                </div>
                <CategoriesGrid
                    categories={categories}
                    selectedCategoryId={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    variant="carousel"
                />
            </div>
            )}

            <div className="relative flex flex-col gap-8 sm:gap-12">
                {/* Integrated Filter Panel (Slide-out or Overlaid) */}
                {showFilters && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-0 pointer-events-auto md:p-6">
                        <div className="h-dvh w-[min(92vw,28rem)] overflow-y-auto rounded-none border-l border-white/20 bg-background p-4 shadow-2xl animate-in slide-in-from-right duration-300 md:h-[calc(100dvh-3rem)] md:rounded-[2rem] md:p-6">
                            <div className="mb-5 flex items-center justify-between sm:mb-8">
                                <h3 className="text-xl font-serif sm:text-2xl">{tPage('filters')}</h3>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setShowFilters(false)}
                                    className="rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <ProductFilters
                                manufacturers={manufacturers}
                                productTypes={productTypes}
                                selectedManufacturers={selectedManufacturers}
                                selectedProductTypes={selectedProductTypes}
                                priceRange={priceRange}
                                inStockOnly={inStockOnly}
                                onManufacturerToggle={toggleManufacturer}
                                onProductTypeToggle={toggleProductType}
                                onPriceRangeChange={setPriceRange}
                                onInStockOnlyChange={setInStockOnly}
                                onClearFilters={clearFilters}
                                isVisible={true}
                                minPrice={products.length > 0 ? Math.floor(Math.min(...products.map(p => parseFloat(p.price)))) : 0}
                                maxPrice={products.length > 0 ? Math.ceil(Math.max(...products.map(p => parseFloat(p.price)))) : 5000}
                            />
                        </div>
                    </div>
                )}

                {/* Asymmetric Product Gallery */}
                <div className="flex-1">
                    <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground italic sm:mb-8">
                        <div>
                            {t('showing', { count: filteredProducts.length })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
                        {visibleProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                showMetadata={true}
                                showLowStockWarning={true}
                                className="h-full w-full rounded-2xl"
                            />
                        ))}
                    </div>

                    {visibleProducts.length === 0 && (
                        <div className="rounded-2xl py-16 text-center sm:rounded-[3rem] sm:py-24">
                            <p className="text-muted-foreground font-serif text-xl">{t('noProducts')}</p>
                        </div>
                    )}

                    {/* Pagination as an Editorial Footer */}
                    {isCatalogPage && totalPages > 1 && (
                        <div className="mt-10 flex flex-col items-center gap-5 border-t border-surface-container-low py-8 sm:mt-20 sm:gap-8 sm:py-12">
                            <Pagination>
                                <PaginationContent className="max-w-full flex-wrap justify-center gap-1 sm:gap-2">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            className={cn(
                                                "rounded-full px-6 py-2 transition-all",
                                                currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-surface-container-low'
                                            )}
                                        >
                                            {tPage('previous')}
                                        </PaginationPrevious>
                                    </PaginationItem>

                                    {getPageNumbers().map((page, index) => (
                                        <PaginationItem key={index}>
                                            {page === '...' ? (
                                                <PaginationEllipsis />
                                            ) : (
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(page as number)}
                                                    isActive={currentPage === page}
                                                    className={cn(
                                                        "rounded-full w-12 h-12 flex items-center justify-center transition-all",
                                                        currentPage === page 
                                                            ? "bg-primary text-primary-foreground shadow-lg" 
                                                            : "hover:bg-surface-container-low"
                                                    )}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            className={cn(
                                                "rounded-full px-6 py-2 transition-all",
                                                currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-surface-container-low'
                                            )}
                                        >
                                            {tPage('next')}
                                        </PaginationNext>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>

                            <div className="text-center text-sm text-muted-foreground font-serif italic">
                                {tPage('pageOf', { current: currentPage, total: totalPages })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
