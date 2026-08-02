"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Check,
  X,
  ImageOff,
  LogIn,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatPrice } from "@/lib/store/productdetail/product";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import { useAuth } from "@/features/auth/useAuth";
import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import {
  StorefrontItemResponse,
  ItemVariant,
  primaryItemImage,
  itemImageUrl,
} from "@/lib/type/storeType";
import {
  resolveMediaUrl,
  apiErrorMessage,
  isUnauthorized,
} from "@/lib/type/cartType";

interface ProductQuickViewModalProps {
  productId?: string;
  item?: MenuItemData;
  rawItem?: StorefrontItemResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductQuickViewModal({
  item,
  rawItem,
  open,
  onOpenChange,
}: ProductQuickViewModalProps) {
  const product: StorefrontItemResponse | undefined = rawItem ?? item?.rawItem;

  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const { isAuthenticated, status: authStatus, login } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const name = product?.name ?? item?.name ?? "Product";
  const description = product?.description ?? item?.description ?? "";

  const allImages = useMemo(() => {
    const list: string[] = [];
    if (product?.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const url = itemImageUrl(img);
        if (url) list.push(url);
      });
    }
    if (list.length === 0 && item?.image) {
      const url = resolveMediaUrl(item.image);
      if (url) list.push(url);
    }
    return list;
  }, [product, item]);

  const mainImage = useMemo(
    () => allImages[activeImageIndex] ?? primaryItemImage(product) ?? resolveMediaUrl(item?.image) ?? null,
    [allImages, activeImageIndex, product, item],
  );

  const basePrice =
    product?.price !== undefined && product?.price !== null
      ? Number(product.price)
      : item?.price
        ? parseFloat(item.price)
        : 0;

  const variants: ItemVariant[] = product?.variants ?? [];

  const attributes: Record<string, unknown> =
    product?.attributes && typeof product.attributes === "object"
      ? product.attributes
      : {};

  useEffect(() => {
    if (!open) return;

    setQuantity(1);
    setJustAdded(false);
    setAddError(null);
    setNeedsLogin(false);
    setActiveImageIndex(0);
    setSelectedVariant(variants.length > 0 ? variants[0] : null);

    const initialAttrs: Record<string, string> = {};
    Object.entries(attributes).forEach(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) {
        initialAttrs[key] = String(val[0]);
      } else if (typeof val === "string" || typeof val === "number") {
        initialAttrs[key] = String(val);
      }
    });
    setSelectedAttributes(initialAttrs);

    const rafId = requestAnimationFrame(() => {
      const modalEl = document.querySelector('[data-slot="dialog-content"]');
      if (modalEl) {
        modalEl.scrollTop = 0;
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [open, product?.id]);

  const unitPrice =
    selectedVariant?.price !== undefined && selectedVariant?.price !== null
      ? Number(selectedVariant.price)
      : basePrice;

  async function handleAddToCart() {
    setAddError(null);
    setNeedsLogin(false);

    if (!product?.businessId || !product?.id) {
      setAddError("This product is not available for ordering yet.");
      return;
    }

    if (!isAuthenticated) {
      setNeedsLogin(true);
      return;
    }

    toast.success(`Added ${quantity} × ${name} to cart`);
    onOpenChange(false);

    try {
      await addToCartMutation({
        businessId: product.businessId,
        itemId: product.id,
        variantId: selectedVariant?.id,
        quantity,
        itemDetails: {
          name,
          price: unitPrice,
          imageUrl: mainImage,
          storeName: product?.businessName ?? "Store",
        },
      }).unwrap();
    } catch (err) {
      if (isUnauthorized(err)) {
        setNeedsLogin(true);
        toast.error("Please sign in to add items to your cart.");
        return;
      }
      const errMsg = apiErrorMessage(err, "Could not add to cart. Please try again.");
      setAddError(errMsg);
      toast.error(errMsg);
    }
  }

  const canOrder = Boolean(product?.businessId && product?.id);
  const disabled = isAdding || authStatus === "loading" || !canOrder;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative flex max-h-[82vh] w-[92vw] max-w-3xl flex-col overflow-hidden rounded-3xl border-none bg-background p-4 sm:p-6 md:max-w-4xl md:p-7 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">{name}</DialogTitle>

        <button
          autoFocus
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 text-foreground transition-colors hover:bg-muted dark:bg-black/60 dark:text-neutral-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden md:flex-row md:gap-7">
          {/* Left Column: Product Showcase */}
          <div className="flex shrink-0 flex-col gap-3 max-h-[300px] sm:flex-row sm:max-h-[340px] md:max-h-full md:w-1/2">
            {allImages.length > 1 && (
              <div className="flex shrink-0 gap-2 overflow-x-auto py-1 sm:flex-col sm:overflow-y-auto">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-14 sm:w-14 ${
                      activeImageIndex === idx
                        ? "border-[#00932A] ring-2 ring-[#00932A]/20"
                        : "border-border/60 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${name} thumbnail ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-2xl border border-border/40 bg-muted/30">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover transition-all duration-300"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageOff className="h-10 w-10 text-muted-foreground/50" />
                  <span className="text-xs">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Scrollable Details & Fixed Purchase Action Bar */}
          <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden md:w-1/2">
            {/* Scrollable Upper Area (Title, Price, Options, Details) */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1.5 scrollbar-thin">
              {/* Category / Badge */}
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#00932A]/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00932A]">
                  {product?.itemGroup?.name ?? item?.category ?? "NEW ARRIVAL"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {name}
              </h1>

              {/* Pricing */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-[#00932A] sm:text-3xl">
                  {formatPrice(unitPrice)}
                </span>
                {basePrice > unitPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(basePrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {description}
                </p>
              )}

              {/* Variants */}
              {variants.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-foreground">
                    Variant Options:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const variantDisplayName =
                        v.variantName ||
                        v.name ||
                        v.variant_name ||
                        v.title ||
                        `Option ${v.id}`;

                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`flex min-w-16 flex-col items-center rounded-xl border px-3 py-1.5 text-xs transition-all ${
                            isSelected
                              ? "border-[#00932A] bg-[#00932A]/10 font-bold text-[#00932A] shadow-xs"
                              : "border-border bg-card text-foreground hover:border-[#00932A]"
                          }`}
                        >
                          <span>{variantDisplayName}</span>
                          <span className="text-[10px] opacity-80">
                            {formatPrice(Number(v.price))}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Attributes */}
              {Object.entries(attributes).map(([attrKey, attrVal]) => {
                const options = Array.isArray(attrVal)
                  ? attrVal.map(String)
                  : [String(attrVal)];
                const currentSelected = selectedAttributes[attrKey];

                return (
                  <div key={attrKey} className="space-y-1.5 pt-1">
                    <p className="text-xs font-semibold text-foreground">
                      {attrKey}:{" "}
                      {currentSelected && (
                        <span className="font-bold text-[#00932A]">
                          {currentSelected}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => {
                        const isSelected = currentSelected === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() =>
                              setSelectedAttributes((prev) => ({
                                ...prev,
                                [attrKey]: opt,
                              }))
                            }
                            className={`rounded-xl border px-3 py-1.5 text-xs transition-all ${
                              isSelected
                                ? "border-[#00932A] bg-[#00932A]/10 font-bold text-[#00932A] shadow-xs"
                                : "border-border bg-card text-foreground hover:border-[#00932A]"
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

              {/* Item Specifications & Details */}
              <div className="mt-4 border-t border-border/50 pt-3">
                <h3 className="mb-1.5 text-xs font-bold text-foreground">Description & Details</h3>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/30 p-2.5 text-[11px] text-muted-foreground sm:grid-cols-3">
                  {item?.category && (
                    <div>
                      <span className="font-medium text-foreground">Category: </span>
                      {item.category}
                    </div>
                  )}
                  {product?.unit?.name && (
                    <div>
                      <span className="font-medium text-foreground">Unit: </span>
                      {product.unit.name} ({product.unit.symbol})
                    </div>
                  )}
                  {product?.code && (
                    <div>
                      <span className="font-medium text-foreground">Code: </span>
                      {product.code}
                    </div>
                  )}
                  {product?.sku && (
                    <div>
                      <span className="font-medium text-foreground">SKU: </span>
                      {product.sku}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Fixed Action Bar (Stepper + Add to Cart + Badges) */}
            <div className="shrink-0 space-y-2.5 border-t border-border/60 bg-background pt-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[#00932A]/10 hover:text-[#00932A] disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[#00932A]/10 hover:text-[#00932A]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={disabled}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#00932A] text-sm font-semibold text-white shadow-md transition-all hover:bg-[#007a22] active:scale-98 disabled:opacity-60"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {justAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2 font-bold"
                      >
                        <Check className="h-4 w-4" />
                        Added to Cart
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {isAdding
                          ? "Adding..."
                          : `Add to Cart · ${formatPrice(unitPrice * quantity)}`}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {needsLogin && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-3 py-1.5">
                  <p className="text-xs text-muted-foreground">
                    Sign in to save this to your cart.
                  </p>
                  <button
                    onClick={login}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#00932A] px-3 py-1 text-xs font-medium text-white hover:bg-[#007a22]"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Sign in
                  </button>
                </div>
              )}

              {addError && <p className="text-xs text-destructive">{addError}</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}