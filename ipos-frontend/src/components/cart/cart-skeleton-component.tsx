import { Skeleton } from "@/components/ui/skeleton";

export default function CartSkeletonComponent() {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-45 w-full rounded-xl" />

            <div className="flex flex-col items-start gap-8 lg:flex-row">
                <div className="flex w-full flex-1 flex-col gap-4">
                    {[0, 1, 2].map((row) => (
                        <Skeleton key={row} className="h-33.5 w-full rounded-xl" />
                    ))}
                </div>

                <Skeleton className="h-80 w-100 rounded-xl" />
            </div>
        </div>
    );
}