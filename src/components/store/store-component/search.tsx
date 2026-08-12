"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Clock, Loader2, Search, SearchX, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  useGetBusinessCategoryQuery,
  useGetPublicStoresQuery,
} from "@/features/store-api/store-api"
import { toStoreCard } from "@/lib/type/storeType"

interface SearchDrawerProps {
  value?: string
  onChange?: (value: string) => void
  recentSearches?: string[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

const DEBOUNCE_MS = 350
const RECENTS_KEY = "recent-store-searches"
const MAX_RECENTS = 5

function loadRecents(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecents(list: string[]) {
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(list))
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

const SearchDrawer = ({
  value,
  onChange,
  recentSearches: controlledRecents,
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
}: SearchDrawerProps) => {
  const [localValue, setLocalValue] = useState("")
  const currentValue = value ?? localValue

  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen
  const setOpen = (next: boolean) => {
    if (onOpenChange) {
      onOpenChange(next)
      return
    }
    setInternalOpen(next)
  }

  const [recents, setRecents] = useState<string[]>([])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecents(loadRecents())
  }, [])

  const recentSearches = controlledRecents ?? recents

  const handleChange = (next: string) => {
    if (onChange) {
      onChange(next)
      return
    }
    setLocalValue(next)
  }

  const addRecent = (term: string) => {
    if (controlledRecents) return
    const trimmed = term.trim()
    if (!trimmed) return
    setRecents((prev) => {
      const next = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(
        0,
        MAX_RECENTS,
      )
      saveRecents(next)
      return next
    })
  }

  const removeRecent = (term: string) => {
    setRecents((prev) => {
      const next = prev.filter((t) => t !== term)
      saveRecents(next)
      return next
    })
  }

  const clearRecents = () => {
    setRecents([])
    saveRecents([])
  }

  const handleRecentClick = (term: string) => handleChange(term)

  const [debouncedKeyword, setDebouncedKeyword] = useState("")
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedKeyword(currentValue.trim())
    }, DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [currentValue])

  // Match the typed term against category names so we can also search "by category".
  const { data: categories = [] } = useGetBusinessCategoryQuery()
  const matchedCategoryIds = useMemo(() => {
    if (!debouncedKeyword) return []
    const term = debouncedKeyword.toLowerCase()
    const ids: string[] = []
    for (const categoryItem of categories) {
      if (categoryItem.name?.toLowerCase().includes(term)) {
        ids.push(categoryItem.id)
      }
      for (const sub of categoryItem.subCategories ?? []) {
        if (sub.name?.toLowerCase().includes(term)) {
          ids.push(sub.id)
        }
      }
    }
    return ids
  }, [categories, debouncedKeyword])

  // Search by store name.
  const { data: nameData, isFetching: isFetchingByName } = useGetPublicStoresQuery(
    { keyword: debouncedKeyword, size: 8 },
    { skip: !debouncedKeyword },
  )

  // Search by location (city / province).
  const { data: locationData, isFetching: isFetchingByLocation } = useGetPublicStoresQuery(
    { cityOrProvince: debouncedKeyword, size: 8 },
    { skip: !debouncedKeyword },
  )

  // Search by matching category names.
  const { data: categoryData, isFetching: isFetchingByCategory } = useGetPublicStoresQuery(
    { categoryIds: matchedCategoryIds, size: 8 },
    { skip: !debouncedKeyword || matchedCategoryIds.length === 0 },
  )

  const results = useMemo(() => {
    const byId = new Map<string, ReturnType<typeof toStoreCard>>()
    for (const page of [nameData, locationData, categoryData]) {
      for (const store of page?.content ?? []) {
        const card = toStoreCard(store)
        if (!byId.has(card.id)) byId.set(card.id, card)
      }
    }
    return [...byId.values()]
  }, [nameData, locationData, categoryData])

  const showResults = currentValue.trim().length > 0
  const searching =
    isFetchingByName ||
    isFetchingByLocation ||
    (matchedCategoryIds.length > 0 && isFetchingByCategory) ||
    (currentValue.trim() !== debouncedKeyword && currentValue.trim().length > 0)

  useEffect(() => {
    if (!searching && debouncedKeyword && results.length > 0) {
      addRecent(debouncedKeyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, debouncedKeyword, results.length])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger
          render={
            <button
              type="button"
              aria-label="Open search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/70 bg-white shadow-sm transition-colors duration-200 hover:bg-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              <Search className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
            </button>
          }
        />
      )}

      <DialogContent
        showCloseButton={false}
        className="
          fixed inset-0 top-0 left-0 z-50 flex h-full w-full max-w-full
          translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden
          rounded-none border-0 p-0 bg-white dark:bg-[#2e302f]
          sm:h-full sm:w-full sm:max-w-full sm:rounded-none
          xl:inset-auto xl:left-[50%] xl:top-[50%] xl:min-h-[560px] xl:max-h-[92vh]
          xl:w-[min(90vw,860px)] xl:max-w-4xl xl:-translate-x-1/2 xl:-translate-y-1/2
          xl:rounded-2xl xl:border dark:border-[#293831]
        "
      >
        {/* iOS-style search bar: input + inline Cancel link */}
        <div className="flex shrink-0 items-center gap-2 border-b dark:border-[#293831] px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search by name or category"
              className="
                h-9
                w-full
                rounded-xl
                border
                border-input
                bg-white
                dark:bg-[#34463e]
                dark:border-[#34463e]
                dark:text-[#f3f7f4]
                dark:placeholder:text-[#a7b4ad]
                pl-9
                pr-9
                text-sm
                text-foreground
                placeholder:text-muted-foreground
                focus:outline-none
                focus:ring-1
                focus:ring-primary/30
                sm:h-10
                sm:text-base
              "
            />
            {currentValue && (
              <button
                type="button"
                onClick={() => handleChange("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-muted-foreground/30 dark:bg-muted-foreground/50 text-background dark:text-[#2e302f] hover:bg-muted-foreground/50 dark:hover:bg-muted-foreground/70"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <DialogClose>
            <span className="shrink-0 whitespace-nowrap px-1 text-sm font-medium text-primary dark:text-[#35cc60] hover:opacity-70 sm:text-base">
              Cancel
            </span>
          </DialogClose>
        </div>

        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto p-4 sm:p-5 dark:bg-[#2e302f]">
          {showResults ? (
            <div className="space-y-2.5">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground dark:text-[#a7b4ad]">
                {searching ? "Searching..." : `Results (${results.length})`}
              </h4>

              {searching ? (
                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground dark:text-[#a7b4ad]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Looking for &quot;{currentValue}&quot;...
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 no-scrollbar xl:max-h-80 xl:overflow-y-auto">
                  {results.map((store) => (
                    <DialogClose key={store.id}>
                      <Link
                        href={`/store/${store.slug || store.id}`}
                        onClick={() => addRecent(currentValue)}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3.5
                          rounded-xl
                          px-3.5
                          py-2.5
                          text-foreground
                          dark:text-[#f3f7f4]
                          transition-colors
                          hover:bg-primary/5
                          dark:hover:bg-primary/10
                        "
                      >
                        {store.image ? (
                          <img
                            src={store.image}
                            alt={store.name}
                            className="h-12 w-12 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-sm font-semibold text-primary dark:text-[#35cc60]">
                            {store.name?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-base dark:text-[#f3f7f4]">{store.name}</p>
                          {store.category && (
                            <p className="truncate text-xs sm:text-sm text-muted-foreground dark:text-[#a7b4ad]">
                              {store.category}
                            </p>
                          )}
                        </div>
                      </Link>
                    </DialogClose>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <SearchX className="h-6 w-6 text-muted-foreground dark:text-[#a7b4ad]" />
                  <p className="text-sm text-muted-foreground dark:text-[#a7b4ad]">
                    No stores found for &quot;{currentValue}&quot;
                  </p>
                </div>
              )}
            </div>
          ) : (
            recentSearches.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground dark:text-[#a7b4ad]">
                    Recent Searches
                  </h4>
                  {!controlledRecents && (
                    <button
                      type="button"
                      onClick={clearRecents}
                      className="text-xs font-medium text-muted-foreground dark:text-[#a7b4ad] hover:text-foreground dark:hover:text-[#f3f7f4]"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-0.5">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-md
                        px-2.5
                        py-2
                        text-sm
                        text-foreground
                        dark:text-[#f3f7f4]
                        transition-colors
                        hover:bg-primary/5
                        dark:hover:bg-primary/10
                      "
                    >
                      <button
                        type="button"
                        onClick={() => handleRecentClick(term)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground dark:text-[#a7b4ad]" />
                        {term}
                      </button>
                      {!controlledRecents && (
                        <button
                          type="button"
                          onClick={() => removeRecent(term)}
                          aria-label={`Remove ${term}`}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5 text-muted-foreground dark:text-[#a7b4ad] hover:text-foreground dark:hover:text-[#f3f7f4]" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SearchDrawer
