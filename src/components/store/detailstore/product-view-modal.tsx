"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check, X, ArrowUpRight } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  formatPrice,
  computeDiscountPct,} from "@/lib/store/productdetail/product";
import {
  useAddToCartMutation,
  useGetProductQuery,} from "@/lib/store/productdetail/productApi";

interface ProductQuickViewModalProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;}

export default function ProductQuickViewModal({
  productId,
  open,
  onOpenChange,
}: ProductQuickViewModalProps) {
  const { data: product, isLoading, isError } = useGetProductQuery(productId);
  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();

  const [sugarLevel, setSugarLevel] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const selectedSize = product?.sizes.find((s) => s.value === size);
  const unitPrice = product ? product.price + (selectedSize?.priceModifier ?? 0) : 0;
  const discountPct = product
    ? computeDiscountPct(product.price, product.compareAtPrice)
    : null;

  
  async function handleAddToCart() {
    if (!product) return;
    try {
      await addToCartMutation({
        productId: product.id,
        sugarLevel,
        size,
        quantity,
      }).unwrap();
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-none p-0 shadow-2xl sm:max-w-md [&>button]:hidden">
        {isLoading || !product ? (
          <div className="flex flex-col gap-3 p-8">
            <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        ) : isError ? (
          <div className="p-8 text-sm text-destructive">
            Couldn&apos;t load this product. Try again in a moment.
          </div>
        ) : (
          <div className="grid grid-cols-1">
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="450px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              <button
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm backdrop-blur transition-colors hover:bg-white dark:bg-black/60 dark:text-neutral-200 dark:hover:bg-black/80"
              >
                <X className="h-4 w-4" />
              </button>

              {discountPct !== null && (
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm"
                >
                  {discountPct}% OFF
                </motion.span>
              )}
            </div>

            <div className="flex flex-col gap-4 p-4 sm:p-5">
              {/* Title + price */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  {product.badge && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-brand">
                      {product.badge}
                    </span>
                  )}
                  <h2 className="mt-0.5 text-lg font-bold leading-snug sm:text-xl">
                    {product.name}
                  </h2>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <div className="text-xl font-bold text-brand">
                      {formatPrice(unitPrice)}
                    </div>
                    
                      <>
                        <span className="text-muted-foreground">·</span>
                        
                        
                      </>
                  
                  </div>
                </div>

                <Link
                  href={"storeSlug/product/productSlug"}
                  aria-label="View full product details"
                  className="group flex shrink-0 items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand"
                >
                  Details
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="h-px w-full bg-border" />

              {/* Sugar Level */}
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  Sugar Level{" "}
                  {sugarLevel && (
                    <span className="font-medium text-foreground">
                      · {sugarLevel}%
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sugarLevels.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSugarLevel(opt.value)}
                      className={`min-w-12 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        sugarLevel === opt.value
                          ? "border-brand bg-brand-soft text-brand"
                          : "border-border bg-card text-foreground hover:border-brand/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  Size{" "}
                  {selectedSize && (
                    <span className="font-medium text-foreground">
                      · {selectedSize.label}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSize(opt.value)}
                      className={`flex min-w-16 flex-col items-center rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                        size === opt.value
                          ? "border-brand bg-brand-soft text-brand"
                          : "border-border bg-card text-foreground hover:border-brand/50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="text-[10px] opacity-80">
                        {formatPrice(product.price + (opt.priceModifier ?? 0))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Add to cart */}
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
                  disabled={isAdding}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {justAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Added
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

             
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}