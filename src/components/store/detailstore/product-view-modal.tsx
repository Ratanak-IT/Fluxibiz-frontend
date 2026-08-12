"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import { useAuth } from "@/features/auth/useAuth";
import { MenuItemData, markItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { StorefrontItemResponse, ItemVariant, primaryItemImage } from "@/lib/type/storeType";
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

  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const { isAuthenticated, status: authStatus, login } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
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
      setSelectedVariant(variants[0] ?? null);

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

    try {
      await addToCartMutation({
        businessId: product.businessId,
        itemId: product.id,
        quantity,
        variantId: selectedVariant?.id,
        itemDetails: {
          name: product.name,
          price: selectedVariant?.price ?? product.price,
          imageUrl: primaryItemImage(product),
          currency: currency || item?.currency,
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
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
