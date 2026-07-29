"use client"
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { useGetBusinessCategoryQuery } from "@/features/store-api/store-api";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useState } from "react";

const VisitCount = 10;

export default function StoreFilterComponent() {
  const [selected, setSelected] = useState<number[]>([]);
  const [showMore, setShowMore] = useState(false);

  const { data: category = [], isLoading, isError } = useGetBusinessCategoryQuery();
  const mainCategory = category.filter((c) => c.level === 1);
  const visitTypes = mainCategory.slice(0, VisitCount);
  const extraTypes = mainCategory.slice(VisitCount);

  const toggle = (id: number) => {
    setSelected((selected) =>
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  };

  return (
    <div className="w-full space-y-3">

    <button
        type="button"
        className="
            flex h-8 w-8 
            items-center justify-center 
            rounded-full

            bg-card

            shadow-sm
            hover:bg-accent
            transition-colors
        "
    >
        <Search className="h-4 w-4" />
    </button>



    <div className="space-y-0.5">

        <h2 className="text-xl font-bold text-foreground">
            Filters
        </h2>

        <p className="text-sm text-muted-foreground">
            Browse by Category
        </p>

    </div>



    <div>

        <h4 className="mb-2 text-lg font-medium text-foreground">
            Shop types
        </h4>



        {isLoading && (

            <div
                className="
                    flex items-center gap-2 
                    text-sm text-muted-foreground
                "
            >
                <Loader2 className="h-4 w-4 animate-spin" />

                Loading...
            </div>

        )}



        {isError && !isLoading && (

            <div className="text-sm text-destructive">
                Can not load store type
            </div>

        )}



        {!isLoading && !isError && (

            <>

                <div className="space-y-2.5">

                    {visitTypes.map((cateType) => (

                        <div
                            key={cateType.id}
                            className="flex items-center gap-2"
                        >

                            <Checkbox
                                id={String(cateType.id)}
                                checked={selected.includes(cateType.id)}
                                onCheckedChange={() =>
                                    toggle(cateType.id)
                                }
                            />


                            <Label
                                htmlFor={String(cateType.id)}
                                className="
                                    cursor-pointer 
                                    text-sm font-medium
                                    text-foreground
                                "
                            >
                                {cateType.name}
                            </Label>


                        </div>

                    ))}

                </div>



                {extraTypes.length > 0 && (

                    <Collapsible
                        open={showMore}
                        onOpenChange={setShowMore}
                    >

                        <CollapsibleContent
                            className="
                                space-y-2.5 
                                pt-3
                            "
                        >

                            {extraTypes.map((cateType) => (

                                <div
                                    key={cateType.id}
                                    className="
                                        flex items-center gap-2
                                    "
                                >

                                    <Checkbox
                                        id={String(cateType.id)}
                                        checked={selected.includes(cateType.id)}
                                        onCheckedChange={() =>
                                            toggle(cateType.id)
                                        }
                                    />


                                    <Label
                                        htmlFor={String(cateType.id)}
                                        className="
                                            cursor-pointer 
                                            text-sm font-medium
                                            text-foreground
                                        "
                                    >
                                        {cateType.name}
                                    </Label>


                                </div>

                            ))}


                        </CollapsibleContent>



                        <CollapsibleTrigger
                            className="
                                mt-3 flex items-center gap-1 
                                text-sm font-medium 
                                text-primary 
                                hover:underline
                            "
                        >

                            {showMore
                                ? "Show less"
                                : "Show more"
                            }


                            <ChevronDown
                                className={`
                                    h-4 w-4 
                                    transition-transform
                                    ${
                                        showMore
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />

                        </CollapsibleTrigger>


                    </Collapsible>

                )}

            </>

        )}

    </div>

</div>
  );
}