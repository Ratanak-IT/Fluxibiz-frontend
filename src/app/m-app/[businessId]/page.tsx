"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, X, CheckCircle, Loader2 } from "lucide-react";

type StoreDetail = {
    id: string;
    displayName: string;
    logoUrl?: string;
    coverImageUrl?: string;
    primaryColor?: string;
};

type ProductItem = {
    id: string;
    name: string;
    price: number;
    currency: string;
    imageUrl?: string;
    description?: string;
};

export default function MessengerMiniAppPage({
    params,
}: {
    params: Promise<{ businessId: string }>;
}) {
    const { businessId } = use(params);
    const searchParams = useSearchParams();
    const senderId = searchParams.get("uid"); // Facebook PSID

    const [store, setStore] = useState<StoreDetail | null>(null);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [cart, setCart] = useState<{ item: ProductItem; quantity: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // 1. Fetch Store Profile & Products via Public API
    useEffect(() => {
        async function loadStorefrontData() {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
                
                const [storeRes, itemsRes] = await Promise.all([
                    fetch(`${apiBase}/api/v1/public/stores/${businessId}`),
                    fetch(`${apiBase}/api/v1/public/stores/${businessId}/items`),
                ]);

                if (storeRes.ok) {
                    const storeData = await storeRes.json();
                    setStore(storeData);
                }
                if (itemsRes.ok) {
                    const itemsData = await itemsRes.json();
                    setProducts(itemsData);
                }
            } catch (err) {
                console.error("Failed to load storefront", err);
            } finally {
                setLoading(false);
            }
        }

        loadStorefrontData();
    }, [businessId]);

    // 2. Add Item to Cart
    function addToCart(product: ProductItem) {
        setCart((prev) => {
            const existing = prev.find((c) => c.item.id === product.id);
            if (existing) {
                return prev.map((c) =>
                    c.item.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { item: product, quantity: 1 }];
        });
    }

    // 3. Close Messenger Webview
    function closeMessengerWebview() {
        if (typeof window !== "undefined" && (window as any).MessengerExtensions) {
            (window as any).MessengerExtensions.requestCloseBrowser(
                () => console.log("Webview closed"),
                (err: any) => console.error("Error closing webview", err)
            );
        }
    }

    // 4. Submit Order
    async function handleCheckout() {
        if (cart.length === 0) return;
        setSubmitting(true);

        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
            const response = await fetch(`${apiBase}/api/v1/public/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    senderId, // Facebook PSID
                    items: cart.map((c) => ({ itemId: c.item.id, quantity: c.quantity })),
                }),
            });

            if (response.ok) {
                setOrderSuccess(true);
                // បិទ Webview ដោយស្វ័យប្រវត្តិក្រោយពេលកុម្ម៉ង់ជោគជ័យ ២ វិនាទី
                setTimeout(() => {
                    closeMessengerWebview();
                }, 2000);
            }
        } catch (err) {
            console.error("Checkout failed", err);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="flex h-screen flex-col items-center justify-center p-6 text-center bg-white">
                <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">ការបញ្ជាទិញជោគជ័យ!</h2>
                <p className="mt-2 text-sm text-gray-500">
                    វិក្កយបត្រត្រូវបានផ្ញើទៅកាន់ Messenger Chat របស់អ្នករួចរាល់ហើយ។
                </p>
                <button
                    onClick={closeMessengerWebview}
                    className="mt-6 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white"
                >
                    បិទផ្ទាំងនេះ
                </button>
            </div>
        );
    }

    const totalAmount = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-24 text-gray-900">
            {/* White-label Header with Business Logo & Name */}
            <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white p-4 shadow-sm">
                {store?.logoUrl ? (
                    <Image
                        src={store.logoUrl}
                        alt={store.displayName}
                        width={40}
                        height={40}
                        className="rounded-full border object-cover"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                        {store?.displayName?.charAt(0) || "S"}
                    </div>
                )}
                <div>
                    <h1 className="text-base font-bold">{store?.displayName || "Storefront"}</h1>
                    <p className="text-xs text-gray-500">Messenger Mini App</p>
                </div>
            </header>

            {/* Product Catalog List */}
            <main className="p-4 space-y-4">
                <h2 className="text-sm font-semibold text-gray-700">បញ្ជីផលិតផល</h2>
                <div className="grid grid-cols-2 gap-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col justify-between rounded-2xl border bg-white p-3 shadow-sm"
                        >
                            {product.imageUrl && (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={150}
                                    height={120}
                                    className="h-28 w-full rounded-xl object-cover"
                                />
                            )}
                            <div className="mt-2">
                                <h3 className="text-xs font-semibold line-clamp-1">{product.name}</h3>
                                <p className="mt-1 text-sm font-bold text-blue-600">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                            <button
                                onClick={() => addToCart(product)}
                                className="mt-3 w-full rounded-xl bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                            >
                                + បន្ថែម
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Cart & Checkout Footer Bar */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t bg-white p-4 shadow-lg">
                    <div>
                        <p className="text-xs text-gray-500">{cart.reduce((s, c) => s + c.quantity, 0)} ទំនិញ</p>
                        <p className="text-base font-bold text-blue-600">${totalAmount.toFixed(2)}</p>
                    </div>

                    <button
                        disabled={submitting}
                        onClick={handleCheckout}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <ShoppingBag className="h-4 w-4" />
                        )}
                        បញ្ជាក់ការបញ្ជាទិញ
                    </button>
                </div>
            )}
        </div>
    );
}
