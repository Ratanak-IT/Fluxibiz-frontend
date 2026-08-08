"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, Loader2, Search, SearchX, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useGetPublicStoresQuery } from "@/features/store-api/store-api"
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

  const { data, isFetching } = useGetPublicStoresQuery(
    { keyword: debouncedKeyword, size: 8 },
    { skip: !debouncedKeyword },
  )

  const results = (data?.content ?? []).map(toStoreCard)
  const showResults = currentValue.trim().length > 0
  const searching = isFetching || (currentValue.trim() !== debouncedKeyword && currentValue.trim().length > 0)

  useEffect(() => {
    if (!searching && debouncedKeyword && results.length > 0) {
      addRecent(debouncedKeyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, debouncedKeyword, results.length])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger>
          <Button variant="outline" size="icon" className="rounded-full">
            <Search className=" h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="flex-row items-center justify-between border-b px-5 py-4 space-y-0">
          <DialogTitle className="text-base font-semibold">
            Search
          </DialogTitle>

          <DialogClose>
            <button
              type="button"
              aria-label="Close search"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                text-muted-foreground
                transition-colors
                hover:bg-accent
                hover:text-foreground
              "
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-5 p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              className="h-11 rounded-lg pl-10 pr-9 text-sm"
              placeholder="Search for stores..."
            />
            {currentValue && (
              <button
                type="button"
                onClick={() => handleChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {showResults ? (
            <div className="space-y-2.5">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {searching ? "Searching..." : `Results (${results.length})`}
              </h4>

              {searching ? (
                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Looking for &quot;{currentValue}&quot;...
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-80 space-y-0.5 overflow-y-auto">
                  {results.map((store) => (
                    <DialogClose key={store.id}>
                      <Link
                        href={`/store/${store.slug || store.id}`}
                        onClick={() => addRecent(currentValue)}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-md
                          px-2.5
                          py-2
                          text-sm
                          text-foreground
                          transition-colors
                          hover:bg-primary/5
                        "
                      >
                        {store.image ? (
                          <img
                            src={store.image}
                            alt={store.name}
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {store.name?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium">{store.name}</p>
                          {store.category && (
                            <p className="truncate text-xs text-muted-foreground">
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
                  <SearchX className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No stores found for &quot;{currentValue}&quot;
                  </p>
                </div>
              )}
            </div>
          ) : (
            recentSearches.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Recent Searches
                  </h4>
                  {!controlledRecents && (
                    <button
                      type="button"
                      onClick={clearRecents}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
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
                        transition-colors
                        hover:bg-primary/5
                      "
                    >
                      <button
                        type="button"
                        onClick={() => handleRecentClick(term)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {term}
                      </button>
                      {!controlledRecents && (
                        <button
                          type="button"
                          onClick={() => removeRecent(term)}
                          aria-label={`Remove ${term}`}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
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