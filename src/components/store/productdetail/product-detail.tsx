"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { useAddToCartMutation } from "@/features/cart/cartApi";
import {
  StorefrontItemResponse,
  ItemVariant,
  ItemUomConversion,
  isVariantSelectable,
  resolveItemPrices,
  type ChannelSchedule,
} from "@/lib/type/storeType";
import { useAuth } from "@/features/auth/useAuth";
import { useIsMessenger } from "@/lib/tma/useIsMessenger";
import { useRequireMessengerProfile } from "@/lib/tma/MessengerProfileGate";
import { ProductStorefrontUI } from "./product-storefront-ui";

interface ProductDetailProps {
  item?: StorefrontItemResponse;
  storeSlug?: string;
  storeName?: string;
  currency?: string;
  isLoading?: boolean;
  isStoreOpen?: boolean;
  onlineHours?: ChannelSchedule | null;
}

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
  const { isAuthenticated, login } = useAuth();
  const isMessenger = useIsMessenger();
  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const requireMessengerProfile = useRequireMessengerProfile();

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedPack, setSelectedPack] = useState<ItemUomConversion | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item?.variants && item.variants.length > 0) {
      const buyable = item.variants.find(isVariantSelectable) ?? item.variants[0];
      setSelectedVariant(buyable);
    } else {
      setSelectedVariant(null);
    }

    const initialAttrs: Record<string, string> = {};
    if (item?.attributes && typeof item.attributes === "object") {
      Object.entries(item.attributes).forEach(([key, val]) => {
        if (Array.isArray(val) && val.length > 0) {
          initialAttrs[key] = String(val[0]);
        } else if (typeof val === "string" || typeof val === "number") {
          initialAttrs[key] = String(val);
        }
      });
    }
    setSelectedAttributes(initialAttrs);
    setSelectedPack(null);
    setSelectedAddOnIds([]);
    setQuantity(1);
  }, [item]);

  if (isLoading) {
    return (
      <div className="mx-auto my-10 max-w-7xl px-4 sm:px-6 lg:px-8">
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

  const handleAddToCart = async () => {
    if (!item?.businessId || !item?.id) {
      toast.error(t("errors.itemUnavailable"));
      return;
    }

    // Messenger never goes through the regular Keycloak OAuth login — a
    // brand-new visitor has no tmaSession token yet (one isn't created
    // until they register via the MessengerProfileGate popup below), so
    // `isAuthenticated` would otherwise read false here and bounce them to
    // the Keycloak login page for no reason.
    if (!isMessenger && !isAuthenticated) {
      toast.error(t("errors.signInRequired"));
      login();
      return;
    }

    const businessId = item.businessId;
    const name = item.name || t("detail.product");
    const { sellingPrice } = resolveItemPrices(item, selectedVariant);

    requireMessengerProfile(businessId, () => {
      void (async () => {
        try {
          await addToCartMutation({
            businessId,
            itemId: item.id,
            variantId: selectedVariant?.id,
            addOnIds: selectedAddOnIds,
            unitId: selectedPack?.id,
            quantity,
            itemDetails: {
              name,
              price: sellingPrice,
              storeName: storeName ?? item.businessName ?? t("common.store"),
            },
          }).unwrap();

          toast.success(t("messages.addedToCart", { quantity, name }));
        } catch (err: any) {
          console.error("Failed to add to cart", err);
          const msg = err?.data?.message || err?.data?.error || t("errors.addToCartFailed");
          toast.error(msg);
        }
      })();
    });
  };

  return (
    <div className="mx-auto my-10 max-w-7xl px-4 text-foreground transition-colors sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link href={storeSlug ? `/store/${storeSlug}` : "/store"}>
          <button className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            {storeName ? `${t("common.store")} / ${storeName}` : t("common.store")} / {item.name || t("detail.product")}
          </button>
        </Link>
      </div>

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
