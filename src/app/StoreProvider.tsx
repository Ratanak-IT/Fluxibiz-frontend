"use client";
/* eslint-disable react-hooks/refs */

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../store/store";
import { WebSocketProvider } from "@/lib/websocket/useWebSocket";

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }

    return (
        <Provider store={storeRef.current}>
            <WebSocketProvider>{children}</WebSocketProvider>
        </Provider>
    );
}
