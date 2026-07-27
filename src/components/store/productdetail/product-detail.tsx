

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ShieldCheck,
  RotateCcw,
  Truck,
} from "lucide-react";

import {
  formatPrice,
  computeDiscountPct,
} from "@/lib/store/productdetail/product";
import { useAddToCartMutation, useGetProductQuery } from "@/lib/store/productdetail/productApi";

const ICONS = { truck: Truck, shield: ShieldCheck, refresh: RotateCcw };

interface ProductDetailProps {
  productId?: string;
}

export default function ProductDetail({
  productId = "jasmine-green-tea",
}: ProductDetailProps) {
  const { data: product, isLoading, isError } = useGetProductQuery(productId);
  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();

  const [activeImg, setActiveImg] = useState(0);
  const [sugarLevel, setSugarLevel] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // useEffect(() => {
  //   if (product) {
  //     setSugarLevel(product.defaultSugarLevel);
  //     setSize(product.defaultSize);
  //   }
  // }, [product]);

  if (isLoading || !product) {
    return (
      <div className="p-8 text-sm text-neutral-500 dark:text-neutral-400">
        Loading…
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-sm text-red-500">Failed to load product.</div>;
  }

  const selectedSize = product.sizes.find((s) => s.value === size);
  const unitPrice = product.price + (selectedSize?.priceModifier ?? 0);
  const discountPct = computeDiscountPct(product.price, product.compareAtPrice);

  async function handleAddToCart() {
    try {
      await addToCartMutation({
        productId: product!.id,
        sugarLevel,
        size,
        quantity,
      }).unwrap();
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  }

  return (
   <div className="mx-auto my-10 max-w-7xl px-4 py-5 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between">
    <button className="inline-flex items-center gap-1 pb-6 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
      <ChevronLeft className="h-4 w-4" />
      Store/product/detail
    </button>
  </div>

  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:gap-10">
    {/* Left Column: Image Gallery */}
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnails */}
      <div className="flex flex-row gap-3 overflow-x-auto pb-2 sm:flex-col sm:overflow-x-visible sm:pb-0">
        {product.images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActiveImg(i)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-neutral-100 dark:bg-neutral-800 ${
              i === activeImg
                ? "border-green-600 dark:border-green-500"
                : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
            }`}
          >
            <Image src={src} alt="" width={64} height={64} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 sm:h-128 sm:w-128 md:h-140 md:w-140 lg:h-154.5 lg:w-146">
        <Image
          key={product.images[activeImg]}
          src={product.images[activeImg]}
          alt={product.name}
          width={584}
          height={618}
          className="h-full w-full object-cover"
        />
      </div>
    </div>

    {/* Right Column: Product Info */}
    <div className="grid grid-cols-1 gap-4">
      {product.badge && (
        <span className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-500">
          {product.badge}
        </span>
      )}

      <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-2xl font-bold text-green-600 dark:text-green-500 sm:text-3xl">
          {formatPrice(unitPrice)}
        </span>
        {product.compareAtPrice && (
          <span className="text-md text-neutral-400 line-through dark:text-neutral-500">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {discountPct !== null && (
          <span className="inline-block rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            {discountPct}% OFF
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {product.description}
      </p>

      {/* Sugar Level */}
      <div>
        <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          Sugar Level: <span className="font-medium text-neutral-900 dark:text-white">{sugarLevel}%</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sugarLevels.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSugarLevel(opt.value)}
              className={`min-w-16 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                sugarLevel === opt.value
                  ? "border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-500/10 dark:text-green-400"
                  : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Options */}
      <div>
        <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          Size: <span className="font-medium text-neutral-900 dark:text-white">{selectedSize?.label}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSize(opt.value)}
              className={`flex min-w-18 flex-col items-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                size === opt.value
                  ? "border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-500/10 dark:text-green-400"
                  : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{opt.label}</span>
              <span className="text-xs opacity-80">
                {formatPrice(product.price + (opt.priceModifier ?? 0))}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-9 w-9 items-center justify-center text-3xl font-bold text-red-500 hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center text-base font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-9 w-9 items-center justify-center text-3xl font-bold text-green-600 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-600 text-base font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
      >
        {justAdded ? (
          <>
            <Check className="h-4 w-4" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            {isAdding ? "Adding..." : `Add to Cart · ${formatPrice(unitPrice * quantity)}`}
          </>
        )}
      </button>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800 sm:grid-cols-3">
        {product.perks.map((perk) => {
          const Icon = ICONS[perk.icon];
          return (
            <div key={perk.title} className="flex items-center gap-2.5">
              <Icon className="h-5 w-5 shrink-0 text-green-600 dark:text-green-500" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{perk.title}</p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{perk.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>
  );
}
