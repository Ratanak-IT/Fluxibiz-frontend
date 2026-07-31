"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check, X, ImageOff, LogIn } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/store/productdetail/product";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import { useAuth } from "@/features/auth/useAuth";
import { MenuItemData } from "@/lib/store/detailstore/detailstore";
import {
  StorefrontItemResponse,
  ItemVariant,
  primaryItemImage,
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


  const name = product?.name ?? item?.name ?? "Product";
  const description = product?.description ?? item?.description ?? "";

  const mainImage = useMemo(
    () => primaryItemImage(product) ?? resolveMediaUrl(item?.image) ?? null,
    [product, item],
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

    try {
      await addToCartMutation({
        businessId: product.businessId,
        itemId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      }).unwrap();

      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        onOpenChange(false);
      }, 1200);
    } catch (err) {
      if (isUnauthorized(err)) {
        setNeedsLogin(true);
        return;
      }
      setAddError(apiErrorMessage(err, "Could not add to cart. Please try again."));
    }
  }

  const canOrder = Boolean(product?.businessId && product?.id);
  const disabled = isAdding || authStatus === "loading" || !canOrder;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-none p-0 shadow-2xl sm:max-w-md [&>button]:hidden">
        <DialogTitle className="sr-only">{name}</DialogTitle>

        <div className="grid grid-cols-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={name}
                fill
                unoptimized
                sizes="450px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageOff className="h-8 w-8" />
                <span className="text-xs">No image</span>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm backdrop-blur transition-colors hover:bg-white dark:bg-black/60 dark:text-neutral-200 dark:hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="mt-0.5 text-lg font-bold leading-snug sm:text-xl">
                  {name}
                </h2>

                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <div className="text-xl font-bold text-brand">
                    {formatPrice(unitPrice)}
                  </div>

                  {product?.unit?.symbol && (
                    <span className="text-xs text-muted-foreground">
                      / {product.unit.symbol}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {description && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}

            <div className="h-px w-full bg-border" />

            {variants.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold text-foreground">
                  Variant Options
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex min-w-16 flex-col items-center rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                          isSelected
                            ? "border-brand bg-brand-soft font-bold text-brand"
                            : "border-border bg-card text-foreground hover:border-brand/50"
                        }`}
                      >
                        <span>{v.variantName}</span>
                        <span className="text-[10px] opacity-80">
                          {formatPrice(Number(v.price))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {Object.entries(attributes).map(([attrKey, attrVal]) => {
              const options = Array.isArray(attrVal)
                ? attrVal.map(String)
                : [String(attrVal)];
              const currentSelected = selectedAttributes[attrKey];

              return (
                <div key={attrKey}>
                  <p className="mb-1.5 text-xs font-semibold text-foreground">
                    {attrKey}{" "}
                    {currentSelected && (
                      <span className="font-normal text-muted-foreground">
                        · {currentSelected}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
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
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            isSelected
                              ? "border-brand bg-brand-soft font-bold text-brand"
                              : "border-border bg-card text-foreground hover:border-brand/50"
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

            {(selectedVariant || Object.keys(selectedAttributes).length > 0) && (
              <div className="rounded-xl border border-border/50 bg-neutral-100 px-3 py-2 text-xs text-neutral-700 dark:bg-card dark:text-neutral-300">
                <span className="font-semibold text-foreground">Selected: </span>
                {[
                  selectedVariant?.variantName
                    ? `Variant: ${selectedVariant.variantName}`
                    : null,
                  ...Object.entries(selectedAttributes).map(([k, v]) => `${k}: ${v}`),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card px-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-brand-soft hover:text-brand disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-brand-soft hover:text-brand"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={disabled}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
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
                        : `Add · ${formatPrice(unitPrice * quantity)}`}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {needsLogin && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  Sign in to save this to your cart.
                </p>
                <button
                  onClick={login}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign in
                </button>
              </div>
            )}

            {addError && <p className="mt-1 text-xs text-destructive">{addError}</p>}

            {!canOrder && (
              <p className="text-xs text-muted-foreground">
                This item is preview-only and cannot be ordered.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}