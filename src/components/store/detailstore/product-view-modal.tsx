"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import { useAuth } from "@/features/auth/useAuth";
import { MenuItemData, markItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import {
  StorefrontItemResponse,
  ItemVariant,
  ItemUomConversion,
  primaryItemImage,
  isVariantSelectable,
  sellableAddOns,
  isStorefrontOpen,
} from "@/lib/type/storeType";
import { useGetPublicStoreQuery } from "@/features/store-api/store-api";
import { useTodayHoursLabel } from "./store-hours";
import { ProductStorefrontUI } from "@/components/store/productdetail/product-storefront-ui";
import { apiErrorMessage, formatStockErrorMessage, isUnauthorized } from "@/lib/type/cartType";

interface ProductQuickViewModalProps {
  productId?: string;
  item?: MenuItemData;
  rawItem?: StorefrontItemResponse;
  currency?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductQuickViewModal({
  item,
  rawItem,
  currency,
  open,
  onOpenChange,
}: ProductQuickViewModalProps) {
  const t = useTranslations("Store");
  const tCart = useTranslations("Cart");
  const product: StorefrontItemResponse | undefined = rawItem ?? item?.rawItem;

  // The shop's own record, for its Online Store hours. The detail endpoint
  // takes an id as readily as a slug, and the card that opened this has no
  // slug to hand — only the item, which knows whose shop it is.
  const { data: storeDetail } = useGetPublicStoreQuery(product?.businessId ?? "", {
    skip: !open || !product?.businessId,
  });
  const storeOpen = isStorefrontOpen(storeDetail);
  const todayHours = useTodayHoursLabel(storeDetail?.onlineHours);

  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const { isAuthenticated, status: authStatus, login } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  /** null is the item itself — one of its base unit, rather than a pack. */
  const [selectedPack, setSelectedPack] = useState<ItemUomConversion | null>(null);
  /** The extras ticked, by id. Nothing is ticked to start with. */
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const variants = useMemo<ItemVariant[]>(() => product?.variants ?? [], [product]);
  const attributes = useMemo(() => {
    if (Array.isArray(product?.attributes)) {
      return product.attributes;
    }
    return [];
  }, [product?.attributes]);

  useEffect(() => {
    if (!open) return;

    const rafId = requestAnimationFrame(() => {
      setQuantity(1);
      // Land on something buyable rather than a sold-out first option.
      setSelectedVariant(variants.find(isVariantSelectable) ?? variants[0] ?? null);
      setSelectedPack(null);
      setSelectedAddOnIds([]);

      const initialAttrs: Record<string, string> = {};
      attributes.forEach((attr) => {
        const firstVal = attr.values?.[0];
        if (firstVal) {
          initialAttrs[attr.name] = firstVal.value;
        }
      });
      setSelectedAttributes(initialAttrs);

      const modalEl = document.querySelector('[data-slot="dialog-content"]');
      if (modalEl) {
        modalEl.scrollTop = 0;
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [attributes, open, product?.id, variants]);

  async function handleAddToCart() {
    if (!product?.businessId || !product?.id) {
      toast.error(t("errors.itemUnavailable"));
      return;
    }

    if (!isAuthenticated && authStatus !== "loading") {
      login();
      return;
    }

    // The basket refuses an out-of-hours add anyway; saying so here spares a
    // request that was never going to work.
    if (!storeOpen) {
      toast.error(
        todayHours
          ? `${t("detail.storeClosed")} — ${todayHours}`
          : t("detail.storeClosed"),
      );
      return;
    }

    // Only the ones this item still sells, priced from its own library; the
    // server checks the same thing rather than trusting the tick.
    const extras = sellableAddOns(product).filter((addOn) =>
      selectedAddOnIds.includes(addOn.id),
    );
    const extrasPerUnit = extras.reduce(
      (total, addOn) => total + Number(addOn.price ?? 0),
      0,
    );

    try {
      await addToCartMutation({
        businessId: product.businessId,
        itemId: product.id,
        quantity,
        variantId: selectedVariant?.id,
        unitId: selectedPack?.unit?.id,
        selections: Object.entries(selectedAttributes).map(
          ([attributeName, value]) => ({ attributeName, value }),
        ),
        addOnIds: extras.map((addOn) => addOn.id),
        itemDetails: {
          name: product.name,
          price:
            Number(
              selectedPack?.price ?? selectedVariant?.price ?? product.price ?? 0,
            ) + extrasPerUnit,
          imageUrl: primaryItemImage(product),
          currency: currency || item?.currency,
          addOns: extras.map((addOn) => ({
            addOnId: addOn.id,
            name: addOn.name,
            unitPrice: Number(addOn.price ?? 0),
          })),
        },
      }).unwrap();
      
      toast.success(tCart("addedToCart"));
      onOpenChange(false);
    } catch (err: any) {
        if (isUnauthorized(err)) {
            login();
        } else {
            const msg = formatStockErrorMessage(err, product?.name || item?.name);
            const lower = msg.toLowerCase();
            if (lower.includes("stock") || lower.includes("enough") || lower.includes("negative") || lower.includes("unavailable")) {
                if (product?.id) markItemOutOfStock(product.id);
            }
            toast.error(msg);
        }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden bg-[#f7f8f7] dark:bg-[#121620] p-0 border-none sm:rounded-2xl gap-0">
        <DialogTitle className="sr-only">Product Detail</DialogTitle>
        {product ? (
          <ProductStorefrontUI
            item={product}
            currency={currency}
            onClose={() => onOpenChange(false)}
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
            isStoreOpen={storeOpen}
            onlineHours={storeDetail?.onlineHours}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}