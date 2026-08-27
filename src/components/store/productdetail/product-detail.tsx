"use client";

import { useTranslations } from "next-intl";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/store/productdetail/product";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import {
  StorefrontItemResponse,
  ItemVariant,
  primaryItemImage,
  itemImageUrl,
  remainingStock,
  isVariantSelectable,
  resolveItemPrices,
  type ChannelSchedule,
} from "@/lib/type/storeType";
import { isItemOutOfStock } from "@/lib/store/detailstore/detailstore";
import { useTodayHoursLabel } from "@/components/store/detailstore/store-hours";

import { useAuth } from "@/features/auth/useAuth";

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
  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const todayHours = useTodayHoursLabel(onlineHours);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Extract all images from real item
  const productImages = useMemo(() => {
    if (item?.images && item.images.length > 0) {
      const list: string[] = [];
      const sorted = [...item.images].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );
      sorted.forEach((img) => {
        const url = itemImageUrl(img);
        if (url) list.push(url);
      });
      if (list.length > 0) return list;
    }
    const prim = primaryItemImage(item);
    if (prim) return [prim];
    return [];
  }, [item]);

  // Extract variants
  const variants: ItemVariant[] = useMemo(() => item?.variants ?? [], [item]);

  // Calculate stock details
  const remaining = remainingStock(
    variants.length > 0 ? selectedVariant : item
  );

  const outOfStock =
    (variants.length > 0
      ? !isVariantSelectable(selectedVariant)
      : isItemOutOfStock(item)) ||
    (remaining !== null && remaining <= 0);

  const maxQuantity = remaining === null ? null : Math.max(0, remaining);
  const atStockCeiling = maxQuantity !== null && quantity >= maxQuantity;

  // Auto-clamp quantity if stock ceiling changes or decreases
  useEffect(() => {
    if (maxQuantity !== null && maxQuantity > 0 && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity]);

  // Extract attributes
  const attributes: Record<string, unknown> = useMemo(() => {
    if (item?.attributes && typeof item.attributes === "object") {
      return item.attributes;
    }
    return {};
  }, [item]);

  useEffect(() => {
    if (variants.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      const buyable = variants.find(isVariantSelectable) ?? variants[0];
      setSelectedVariant(buyable);
    } else {
      setSelectedVariant(null);
    }

    const initialAttrs: Record<string, string> = {};
    Object.entries(attributes).forEach(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) {
        initialAttrs[key] = String(val[0]);
      } else if (typeof val === "string" || typeof val === "number") {
        initialAttrs[key] = String(val);
      }
    });
    setSelectedAttributes(initialAttrs);
    setActiveImg(0);
    setQuantity(1);
  }, [item, variants, attributes]);

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

  const name = item.name || t("detail.product");
  const categoryName = item.itemGroup?.name || null;
  const description = item.description || "";

  const { sellingPrice, compareAtPrice: resolvedCompareAt, hasDiscount, discountPercent } = resolveItemPrices(item, selectedVariant);
  const unitPrice = sellingPrice;
  const currentMainImage = productImages[activeImg] || productImages[0] || null;

  async function handleAddToCart() {
    if (!item?.businessId || !item?.id) {
      toast.error(t("errors.itemUnavailable"));
      return;
    }

    if (outOfStock) {
      toast.error(t("detail.outOfStock") || "Product is out of stock");
      return;
    }

    if (maxQuantity !== null && quantity > maxQuantity) {
      toast.error(`Only ${maxQuantity} item(s) left in stock`);
      return;
    }

    if (!isAuthenticated) {
      toast.error(t("errors.signInRequired"));
      login();
      return;
    }

    // The basket refuses an out-of-hours add anyway; saying so here spares a
    // request that was never going to work.
    if (!isStoreOpen) {
      toast.error(
        todayHours
          ? `${t("detail.storeClosed")} — ${todayHours}`
          : t("detail.storeClosed")
      );
      return;
    }

    setAddError(null);
    setJustAdded(true);
    toast.success(t("messages.addedToCart", { quantity, name }));
    setTimeout(() => setJustAdded(false), 2000);

    try {
      await addToCartMutation({
        businessId: item.businessId,
        itemId: item.id,
        variantId: selectedVariant?.id,
        quantity,
        itemDetails: {
          name,
          price: unitPrice,
          compareAtPrice: hasDiscount ? resolvedCompareAt : undefined,
          imageUrl: currentMainImage,
          storeName: storeName ?? item.businessName ?? t("common.store"),
        },
      }).unwrap();
    } catch (err: any) {
      console.error("Failed to add to cart", err);
      setJustAdded(false);
      const msg = err?.data?.message || err?.data?.error || t("errors.addToCartFailed");
      setAddError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="mx-auto my-10 max-w-7xl px-4 text-foreground transition-colors sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link href={storeSlug ? `/store/${storeSlug}` : "/store"}>
          <button className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            {storeName ? `${t("common.store")} / ${storeName}` : t("common.store")} / {name}
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8 lg:grid-cols-[auto_1fr] lg:gap-10">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row items-start">
          {productImages.length > 1 && (
            <div className="flex flex-row gap-3 overflow-x-auto pb-2 sm:flex-col sm:overflow-x-visible sm:pb-0">
              {productImages.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition-all ${
                    i === activeImg
                      ? "border-[#00932A] ring-2 ring-[#00932A]/20"
                      : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <Image
                    src={src}
                    alt={t("detail.thumbnailAlt", { name, number: i + 1 })}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-card max-w-full lg:h-154.5 lg:w-146">
            {currentMainImage ? (
              <Image
                key={currentMainImage}
                src={currentMainImage}
                alt={name}
                width={584}
                height={618}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                <ImageOff className="h-12 w-12" />
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-start space-y-5">
          {categoryName && (
            <div>
              <span className="rounded-full bg-[#00932A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00932A]">
                {categoryName}
              </span>
            </div>
          )}

          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{name}</h1>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-2xl font-bold text-[#00932A] sm:text-3xl">
              {formatPrice(unitPrice, currency)}
            </div>
            {hasDiscount && resolvedCompareAt && (
              <div className="text-lg font-medium text-neutral-400 line-through sm:text-xl">
                {formatPrice(resolvedCompareAt, currency)}
              </div>
            )}
            {hasDiscount && Boolean(discountPercent) && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}

          {outOfStock && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-bold dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-400">
              <span>⚠️</span>
              <span>{t("detail.outOfStock") || "Out of Stock"}</span>
            </div>
          )}

          {!outOfStock && remaining !== null && remaining <= 10 && (
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {t("detail.onlyLeft", { count: remaining })}
            </p>
          )}

          {!isStoreOpen && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="font-bold">{t("detail.storeClosed")}</span>
              {todayHours ? <span>· {todayHours}</span> : null}
            </div>
          )}

          {/* Variants Selection */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Options / Variants:
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const isSel = selectedVariant?.id === v.id;
                  const vName = v.variantName || v.name || v.title || t("detail.option");
                  const selectable = isVariantSelectable(v);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!selectable}
                      onClick={() => {
                        setSelectedVariant(v);
                        const vStock = remainingStock(v);
                        if (vStock !== null && vStock > 0 && quantity > vStock) {
                          setQuantity(vStock);
                        }
                      }}
                      className={`flex flex-col items-center rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                        isSel
                          ? "border-[#00932A] bg-[#00932A]/10 text-[#00932A] shadow-sm"
                          : "border-gray-200 bg-card text-foreground hover:border-gray-300 dark:border-neutral-800"
                      } ${!selectable ? "opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800" : "cursor-pointer"}`}
                    >
                      <span>{vName}</span>
                      {v.price !== undefined && (
                        <span className="text-xs opacity-80">
                          {formatPrice(v.price, currency)}
                        </span>
                      )}
                      {!selectable && (
                        <span className="text-[10px] font-bold text-red-500">
                          {t("detail.outOfStock") || "Out of Stock"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Attributes Selection */}
          {Object.keys(attributes).length > 0 && (
            <div className="space-y-4">
              {Object.entries(attributes).map(([attrKey, attrVal]) => {
                const options: string[] = Array.isArray(attrVal)
                  ? attrVal.map(String)
                  : typeof attrVal === "string" || typeof attrVal === "number"
                    ? [String(attrVal)]
                    : [];

                if (options.length === 0) return null;

                const currentSelected = selectedAttributes[attrKey] || options[0];

                return (
                  <div key={attrKey} className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">
                      {attrKey}:{" "}
                      <span className="font-bold text-foreground">
                        {currentSelected}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => {
                        const isSelected = currentSelected === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              setSelectedAttributes((prev) => ({
                                ...prev,
                                [attrKey]: opt,
                              }))
                            }
                            className={`min-w-16 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                              isSelected
                                ? "border-[#00932A] bg-[#00932A]/10 text-[#00932A] shadow-sm"
                                : "border-gray-200 bg-card text-foreground hover:border-gray-300 dark:border-neutral-800"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-sm font-semibold text-muted-foreground">{t("detail.quantity")}</span>
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-neutral-50 px-3 py-1 dark:border-neutral-800 dark:bg-neutral-900">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full transition-colors disabled:opacity-40 disabled:pointer-events-auto disabled:cursor-not-allowed cursor-pointer"
                disabled={outOfStock || quantity <= 1}
              >
                <Minus className="h-4 w-4 text-red-500" />
              </button>

              <span className="w-8 text-center font-bold">{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  setQuantity((q) =>
                    maxQuantity === null ? q + 1 : Math.min(maxQuantity, q + 1)
                  )
                }
                className="flex h-8 w-8 items-center justify-center text-[#00932A] hover:text-[#007d24] hover:bg-green-50 dark:hover:bg-green-950/40 rounded-full transition-colors disabled:opacity-40 disabled:pointer-events-auto disabled:cursor-not-allowed cursor-pointer"
                disabled={outOfStock || atStockCeiling}
              >
                <Plus className="h-4 w-4 text-[#00932A]" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || justAdded || !isStoreOpen || outOfStock}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#00932A] text-base font-semibold text-white shadow-md transition-all hover:bg-[#007d24] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none disabled:opacity-100 dark:disabled:bg-neutral-800 cursor-pointer"
          >
            {justAdded ? (
              <>
                <Check className="h-5 w-5" />
                {t("detail.addedToCart")}
              </>
            ) : !isStoreOpen ? (
              <>
                <Clock className="h-5 w-5" />
                {t("detail.storeClosed")}
              </>
            ) : outOfStock ? (
              t("detail.outOfStock") || "Out of Stock"
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                {isAdding
                  ? t("detail.adding")
                  : `${t("detail.addToCart")} · ${formatPrice(unitPrice * quantity, currency)}`}
              </>
            )}
          </button>

          {addError && (
            <p className="text-sm text-destructive" role="alert">
              {addError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
