"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import { StorefrontItemResponse, ItemVariant } from "@/lib/type/storeType";
import { useAuth } from "@/features/auth/useAuth";
import { ProductStorefrontUI } from "@/components/store/productdetail/product-storefront-ui";
import { apiErrorMessage, formatStockErrorMessage, isUnauthorized } from "@/lib/type/cartType";
import { markItemOutOfStock } from "@/lib/store/detailstore/detailstore";

interface ProductDetailProps {
  item?: StorefrontItemResponse;
  storeSlug?: string;
  storeName?: string;
  currency?: string;
  isLoading?: boolean;
}

export default function ProductDetail({
  item,
  storeSlug,
  storeName,
  currency,
  isLoading = false,
}: ProductDetailProps) {
  const t = useTranslations("Store");
  const tCart = useTranslations("Cart");
  const { isAuthenticated, status: authStatus, login } = useAuth();
  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const variants = useMemo<ItemVariant[]>(() => item?.variants ?? [], [item]);
  const attributes = useMemo(() => {
    if (Array.isArray(item?.attributes)) {
      return item.attributes;
    }
    return [];
  }, [item?.attributes]);

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    } else {
      setSelectedVariant(null);
    }

    const initialAttrs: Record<string, string> = {};
    attributes.forEach((attr) => {
      const firstVal = attr.values?.[0];
      if (firstVal) {
        initialAttrs[attr.name] = firstVal.label || firstVal.value;
      }
    });
    setSelectedAttributes(initialAttrs);
    setQuantity(1);
  }, [item, variants, attributes]);

  if (isLoading) {
    return (
      <div className="mx-auto my-10 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-96 w-full animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
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

    if (!isAuthenticated && authStatus !== "loading") {
      login();
      return;
    }

    try {
      await addToCartMutation({
        businessId: item.businessId,
        itemId: item.id,
        quantity,
        variantId: selectedVariant?.id,
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
    <div className="mx-auto max-w-5xl bg-[#f7f8f7] dark:bg-[#121620] sm:rounded-2xl sm:my-8 overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800">
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
        />
    </div>
  );
}
