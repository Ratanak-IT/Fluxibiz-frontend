"use client";

import { useState } from "react";
import type { ItemResponse, PublicStoreDetailResponse } from "@/lib/type/storeType";
import { ShoppingCart, X, Plus, Minus, ArrowRight, CheckCircle2 } from "lucide-react";

interface TmaCartDrawerProps {
  store: PublicStoreDetailResponse;
  cartItems: Record<string, number>;
  itemsMap: Record<string, ItemResponse>;
  onAddToCart: (item: ItemResponse) => void;
  onRemoveFromCart: (item: ItemResponse) => void;
}

export default function TmaCartDrawer({
  store,
  cartItems,
  itemsMap,
  onAddToCart,
  onRemoveFromCart,
}: TmaCartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const cartKeys = Object.keys(cartItems).filter((id) => (cartItems[id] || 0) > 0);
  const totalCount = cartKeys.reduce((acc, id) => acc + (cartItems[id] || 0), 0);

  const totalPrice = cartKeys.reduce((acc, id) => {
    const item = itemsMap[id];
    const price = item?.unitPrice ? Number(item.unitPrice) : 0;
    return acc + price * (cartItems[id] || 0);
  }, 0);

  if (totalCount === 0) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setIsOrderPlaced(true);
    }, 1200);
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl p-3.5 shadow-2xl shadow-blue-500/40 flex items-center justify-between transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="relative bg-white/20 p-2 rounded-xl">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs text-blue-100 font-medium">Cart Total</p>
              <p className="text-sm font-bold text-white">${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold">Your Cart ({totalCount})</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {isOrderPlaced ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                  <h3 className="text-lg font-bold text-white">Order Placed Successfully!</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Thank you for ordering from {store.name || store.displayName}. Your order has been sent to the store.
                  </p>
                  <button
                    onClick={() => {
                      setIsOrderPlaced(false);
                      setIsOpen(false);
                    }}
                    className="mt-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30"
                  >
                    Done
                  </button>
                </div>
              ) : (
                cartKeys.map((id) => {
                  const item = itemsMap[id];
                  if (!item) return null;
                  const qty = cartItems[id] || 0;
                  const itemTotal = (Number(item.unitPrice || 0) * qty).toFixed(2);

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="text-xs font-semibold text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-blue-400 font-bold mt-0.5">
                          ${itemTotal}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                        <button
                          onClick={() => onRemoveFromCart(item)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">
                          {qty}
                        </span>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {!isOrderPlaced && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-300">Total Amount:</span>
                  <span className="text-xl text-blue-400">${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Confirm Order & Checkout</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
