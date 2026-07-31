"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import {
  useAddToCartMutation,
  useGetProductQuery,
} from "@/lib/store/productdetail/productApi";

import Link from "next/link";

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
    return (
      <div className="p-8 text-sm text-red-500">Failed to load product.</div>
    );
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
  <div className="mx-auto my-10 max-w-7xl px-4 text-foreground transition-colors sm:px-6 lg:px-8">

  <div className="mb-4 flex items-center justify-between">
    <Link href="/store/storeDetail">
      <button
        className="
          inline-flex items-center gap-1 pb-6 text-sm 
          text-muted-foreground 
          hover:text-foreground
        "
      >
        <ChevronLeft className="h-4 w-4" />
        Store / Product
      </button>
    </Link>
  </div>


  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:gap-10">


    {/* Image Gallery */}
    <div className="flex flex-col-reverse gap-3 sm:flex-row">

      <div className="flex flex-row gap-3 overflow-x-auto pb-2 sm:flex-col sm:overflow-x-visible sm:pb-0">

        {product.images.map((src, i) => (

          <button
            key={src}
            onClick={() => setActiveImg(i)}
            className={`
              relative h-16 w-16 shrink-0 overflow-hidden 
              rounded-lg border-2 bg-muted

              ${
                i === activeImg
                  ? "border-brand"
                  : "border-transparent hover:border-border"
              }
            `}
          >
            <Image
              src={src}
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </button>

        ))}

      </div>

      {/* Main Image */}
      <div
        className="
          relative aspect-square w-full shrink-0 
          overflow-hidden rounded-2xl 
          bg-muted
          sm:h-128 sm:w-128
          md:h-140 md:w-140
          lg:h-154.5 lg:w-146
        "
      >
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



    {/* Product Info */}
    <div className="grid grid-cols-1 gap-4">


      {product.badge && (
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {product.badge}
        </span>
      )}


      <h1 className="text-2xl font-bold sm:text-3xl">
        {product.name}
      </h1>



      <div className="flex flex-wrap items-center gap-3">

        <div
          className="
            text-2xl font-bold text-brand 
            sm:text-3xl
          "
        >
          {formatPrice(unitPrice)}
        </div>


        {product.compareAtPrice && (
          <span className="text-md text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}


        {discountPct !== null && (

          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
            className="
              inline-block rounded-full 
              bg-destructive 
              px-2.5 py-0.5 
              text-xs font-semibold 
              text-white
            "
          >
            {discountPct}% OFF
          </motion.span>

        )}

      </div>



      <p className="text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>



      {/* Sugar Level */}

      <div>

        <p className="mb-2 text-sm text-muted-foreground ">

          Sugar Level:
          {" "}

          <span className="font-medium text-foreground">
            {sugarLevel}%
          </span>

        </p>


        <div className="flex flex-wrap gap-2">

          {product.sugarLevels.map((opt) => (

            <button
              key={opt.value}
              onClick={() => setSugarLevel(opt.value)}
              className={`

                min-w-16 rounded-lg border 
                px-3 py-2 text-sm font-medium 
                transition-colors

                ${
                  sugarLevel === opt.value
                    ?
                    "border-brand bg-brand-soft text-brand"
                    :
                    "border-border bg-card text-foreground hover:border-sidebar-primary"
                }

              `}
            >
              {opt.label}
            </button>

          ))}

        </div>

      </div>



      {/* Size Options */}

      <div>

        <p className="mb-2 text-sm text-muted-foreground ">

          Size:
          {" "}

          <span className="font-medium text-foreground">
            {selectedSize?.label}
          </span>

        </p>


        <div className="flex flex-wrap gap-2">

          {product.sizes.map((opt) => (

            <button
              key={opt.value}
              onClick={() => setSize(opt.value)}
              className={`
                flex min-w-18 flex-col items-center 
                rounded-lg border px-3 py-2 
                text-sm font-medium transition-colors

                ${
                  size === opt.value
                    ?
                    "border-brand bg-brand-soft text-brand"
                    :
                    "border-border bg-card text-foreground hover:border-sidebar-primary"
                }
              `}
            >

              <span>{opt.label}</span>

              <span className="text-xs opacity-80">
                {formatPrice(product.price + (opt.priceModifier ?? 0))}
              </span>

            </button>

          ))}

        </div>

      </div>


      {/* Quantity */}

      <div className="flex items-center gap-4">

        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="
            flex h-9 w-9 items-center justify-center 
            text-3xl font-bold text-destructive 
          
          "
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>


        <span className="w-6 text-center text-base font-semibold">
          {quantity}
        </span>


        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="
            flex h-9 w-9 items-center justify-center 
            text-3xl font-bold text-brand 
            
          "
        >
          <Plus className="h-4 w-4" />
        </button>


      </div>

      {/* Add Cart */}

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="
          flex h-12 w-full items-center justify-center 
          gap-2 rounded-lg 
          bg-primary 
          text-base font-medium 
          text-primary-foreground
          transition-colors
          disabled:opacity-60
          hover:bg-primary/90
        "
      >

        {justAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />

            {isAdding
              ? "Adding..."
              : `Add to Cart · ${formatPrice(unitPrice * quantity)}`}
          </>
        )}

      </button>



      {/* Perks */}

      <div
        className="
          grid grid-cols-1 gap-3 
          border-t border-border 
          pt-4
          sm:grid-cols-3
        "
      >

        {product.perks.map((perk) => {

          const Icon = ICONS[perk.icon];

          return (

            <div
              key={perk.title}
              className="flex items-center gap-2.5"
            >

              <Icon className="h-5 w-5 shrink-0 text-brand" />

              <div className="min-w-0">

                <p className="truncate text-sm font-medium">
                  {perk.title}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {perk.subtitle}
                </p>

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
