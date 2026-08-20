"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import {
  StorefrontItemResponse,
  ItemVariant,
  ItemUomConversion,
  primaryItemImage,
  isVariantSelectable,
  sellableAddOns,
  type ChannelSchedule,
} from "@/lib/type/storeType";
import { useTodayHoursLabel } from "@/components/store/detailstore/store-hours";
import { useAuth } from "@/features/auth/useAuth";
import { ProductStorefrontUI } from "@/components/store/productdetail/product-storefront-ui";
import {formatStockErrorMessage, isUnauthorized } from "@/lib/type/cartType";
import { markItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductDetailProps {
  item?: StorefrontItemResponse;
  storeSlug?: string;
  storeName?: string;
  currency?: string;
  isLoading?: boolean;
  /** Whether the online store is taking orders right now. */
  isStoreOpen?: boolean;
  /** The hours the shop set for its Online Store, when it set any. */
  onlineHours?: ChannelSchedule | null;
}

const EMPTY_ATTRIBUTES: ItemAttribute[] = [];

export default function ProductDetail({
  item,
  storeSlug,
  storeName,
  currency,
  isLoading = false,
  isStoreOpen = true,
  onlineHours,
}: ProductDetailProps) {
  const t = useTranslations("Store");
  const tCart = useTranslations("Cart");
  const { isAuthenticated, status: authStatus, login } = useAuth();
  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const todayHours = useTodayHoursLabel(onlineHours);

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  /** null is the item itself — one of its base unit, rather than a pack. */
  const [selectedPack, setSelectedPack] = useState<ItemUomConversion | null>(null);
  /** The extras ticked, by id. Nothing is ticked to start with: an extra is
      something the shopper asks for, never something they have to untick. */
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const variants = useMemo<ItemVariant[]>(() => item?.variants ?? [], [item]);
  const attributes = item?.attributes ?? EMPTY_ATTRIBUTES;

  useEffect(() => {
    if (variants.length > 0) {
      // Land on something the shopper can actually buy. Defaulting to the
      // first option put them on a sold-out size with the button greyed out
      // and no hint that another size was in stock.
      setSelectedVariant(variants.find(isVariantSelectable) ?? variants[0]);
    } else {
      setSelectedVariant(null);
    }

    // Keyed by the stored value, not the label: that is the identity the
    // chips compare against and the only thing the API accepts. Seeding it
    // with the label meant the pre-selected chip never showed as active
    // whenever a value had one.
    const initialAttrs: Record<string, string> = {};
    attributes
      .filter((attr) => (attr.placement ?? "OPTION") === "OPTION")
      .forEach((attr) => {
        const firstVal =
          attr.values?.find((value) => value.available !== false) ??
          attr.values?.[0];
        if (firstVal) {
          initialAttrs[attr.name] = firstVal.value;
        }
      });
    setSelectedAttributes(initialAttrs);
    // A pack belongs to the option it was declared for, so a new item starts
    // back at the single.
    setSelectedPack(null);
    setSelectedAddOnIds([]);
    setQuantity(1);
  }, [item, variants, attributes]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-12 lg:px-20 sm:my-8">
        <div className="bg-[#f7f8f7] dark:bg-card max-sm:dark:bg-background rounded-2xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800">
          
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 px-6 pt-6 text-sm">
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-2">
            {/* Gallery Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-row sm:flex-col gap-2.5 max-w-full shrink-0">
                <Skeleton className="size-14 rounded-xl" />
                <Skeleton className="size-14 rounded-xl" />
                <Skeleton className="size-14 rounded-xl" />
              </div>
              <div className="relative aspect-square flex-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#f8faf8] dark:bg-card shadow-xs">
                <Skeleton className="size-full" />
              </div>
            </div>

            {/* Details Skeleton */}
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-3/4" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="space-y-2.5 pt-2">
                <Skeleton className="h-3.5 w-16" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <div className="grid gap-4 border-t border-neutral-200/60 dark:border-neutral-800 pt-5 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-4.5 w-4.5 rounded-full shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3.5 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto my-16 max-w-xl px-4 text-center">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          {t("detail.itemNotFound")}
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          {t("detail.itemNotFoundDescription")}
        </p>
        <Link href={storeSlug ? `/store/${storeSlug}` : "/store"}>
          <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00932A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#007d24]">
            <ChevronLeft className="h-4 w-4" />
            {t("common.backToStore")}
          </button>
        </Link>
      </div>
    );
  }

  async function handleAddToCart() {
    if (!item?.businessId || !item?.id) {
      toast.error(t("errors.itemUnavailable"));
      return;
    }

    // The basket refuses an out-of-hours add anyway; saying so here costs a
    // shopper nothing and spares them a request that was never going to work.
    if (!isStoreOpen) {
      toast.error(
        todayHours
          ? `${t("detail.storeClosed")} — ${todayHours}`
          : t("detail.storeClosed"),
      );
      return;
    }

    if (!isAuthenticated && authStatus !== "loading") {
      login();
      return;
    }

    // Priced from the item's own library, and only the ones it still sells:
    // the server checks the same thing, so a stale tick is refused rather
    // than billed.
    const extras = sellableAddOns(item).filter((addOn) =>
      selectedAddOnIds.includes(addOn.id),
    );
    const extrasPerUnit = extras.reduce(
      (total, addOn) => total + Number(addOn.price ?? 0),
      0,
    );

    try {
      await addToCartMutation({
        businessId: item.businessId,
        itemId: item.id,
        quantity,
        variantId: selectedVariant?.id,
        // Which unit is being bought. Absent means one of the base unit —
        // a pack is priced in its own right, so the server needs to know.
        unitId: selectedPack?.unit?.id,
        // What the shopper actually picked. These used to be collected and
        // then dropped on the floor: the basket had no field for them, so a
        // drink ordered at 50% sugar reached the counter saying nothing.
        selections: Object.entries(selectedAttributes).map(
          ([attributeName, value]) => ({ attributeName, value }),
        ),
        // The extras ticked. Only ids travel — the shop's prices are the
        // shop's to state, and a browser does not get to name them.
        addOnIds: extras.map((addOn) => addOn.id),
        itemDetails: {
          name: item.name,
          price:
            Number(
              selectedPack?.price ?? selectedVariant?.price ?? item.price ?? 0,
            ) + extrasPerUnit,
          imageUrl: primaryItemImage(item),
          currency: currency,
          addOns: extras.map((addOn) => ({
            addOnId: addOn.id,
            name: addOn.name,
            unitPrice: Number(addOn.price ?? 0),
          })),
        },
      }).unwrap();

      toast.success(tCart("addedToCart"));
    } catch (err: any) {
      if (isUnauthorized(err)) {
        login();
      } else {
        const msg = formatStockErrorMessage(err, item?.name);
        const lower = msg.toLowerCase();
        if (lower.includes("stock") || lower.includes("enough") || lower.includes("negative") || lower.includes("unavailable")) {
          if (item?.id) markItemOutOfStock(item.id);
        }
        toast.error(msg);
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl bg-[#f7f8f7] dark:bg-[#121620] max-sm:dark:bg-background sm:rounded-2xl sm:my-8 overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800">
      <ProductStorefrontUI
        item={item}
        currency={currency}
        storeSlug={storeSlug}
        storeName={storeName}
        onAddToCart={handleAddToCart}
        isAddingToCart={isAdding}
        quantity={quantity}
        setQuantity={setQuantity}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
        selectedPack={selectedPack}
        setSelectedPack={setSelectedPack}
        selectedAddOnIds={selectedAddOnIds}
        setSelectedAddOnIds={setSelectedAddOnIds}
        isStoreOpen={isStoreOpen}
        onlineHours={onlineHours}
      />
    </div>
  );
}
