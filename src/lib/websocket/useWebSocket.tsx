"use client";

import { createContext, useContext, ReactNode } from "react";

export interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (topic: string, callback: (message: any) => void) => () => void;
  publish: (destination: string, body: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  subscribe: () => () => {},
  publish: () => {},
});

export function getWebSocketUrl(): string {
  return "";
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  return (
    <WebSocketContext.Provider
      value={{
        isConnected: false,
        subscribe: () => () => {},
        publish: () => {},
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function useStompTopic<T = any>(
  _topic: string | null | undefined,
  _onMessage: (data: T, rawMessage: any) => void
) {
  return { isConnected: false };
}
