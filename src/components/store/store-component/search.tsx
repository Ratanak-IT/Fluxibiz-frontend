"use client"

import { Clock, File, Folder, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const SearchDrawer = () => (
 <Dialog>
    <DialogTrigger>
      <Button variant="outline"
       
  size="icon"
  className="rounded-full">
        <Search className=" h-4 w-4" />
    
      </Button>
    </DialogTrigger>

    <DialogContent
      showCloseButton={false}
      className="gap-0 overflow-hidden p-0 sm:max-w-lg"
    >
      <DialogHeader className="flex-row items-center justify-between border-b px-5 py-4 space-y-0">
        <DialogTitle className="text-base font-semibold">
          Search
        </DialogTitle>

        <DialogClose >
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
            className="h-11 rounded-lg pl-10 text-sm"
            placeholder="Search for files, folders, or content..."
          />
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recent Searches
          </h4>

          <div className="space-y-0.5">
            <button
              type="button"
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
                hover:bg-primary/5">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              Project files
            </button>

            <button
              type="button"
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
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              Team documents
            </button>
          </div>
        </div>

        
      </div>
    </DialogContent>
  </Dialog>
)

export default SearchDrawer