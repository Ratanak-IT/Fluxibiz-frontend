"use client";

import { useEffect, useRef, useState, useCallback, createContext, useContext, ReactNode } from "react";
import { Client, StompSubscription, IMessage } from "@stomp/stompjs";

export interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (topic: string, callback: (message: IMessage) => void) => () => void;
  publish: (destination: string, body: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  subscribe: () => () => {},
  publish: () => {},
});

export function getWebSocketUrl(): string {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const host = rawApiUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    return `${protocol}//${host}/ws/customer-display`;
  }

  return "ws://localhost:8080/ws/customer-display";
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, Set<(msg: IMessage) => void>>>(new Map());
  const activeStompSubsRef = useRef<Map<string, StompSubscription>>(new Map());

  useEffect(() => {
    const wsUrl = getWebSocketUrl();

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => {
        return new WebSocket(wsUrl);
      },
      onConnect: () => {
        setIsConnected(true);
        subscriptionsRef.current.forEach((callbacks, topic) => {
          if (!activeStompSubsRef.current.has(topic) && callbacks.size > 0) {
            const sub = client.subscribe(topic, (message) => {
              callbacks.forEach((cb) => cb(message));
            });
            activeStompSubsRef.current.set(topic, sub);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        activeStompSubsRef.current.clear();
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame.headers["message"], frame.body);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      activeStompSubsRef.current.forEach((sub) => sub.unsubscribe());
      activeStompSubsRef.current.clear();
      client.deactivate();
      clientRef.current = null;
    };
  }, []);

  const subscribe = useCallback((topic: string, callback: (message: IMessage) => void) => {
    if (!subscriptionsRef.current.has(topic)) {
      subscriptionsRef.current.set(topic, new Set());
    }

    const callbacks = subscriptionsRef.current.get(topic)!;
    callbacks.add(callback);

    const client = clientRef.current;
    if (client && client.connected && !activeStompSubsRef.current.has(topic)) {
      const sub = client.subscribe(topic, (message) => {
        const topicCallbacks = subscriptionsRef.current.get(topic);
        if (topicCallbacks) {
          topicCallbacks.forEach((cb) => cb(message));
        }
      });
      activeStompSubsRef.current.set(topic, sub);
    }

    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        subscriptionsRef.current.delete(topic);
        const sub = activeStompSubsRef.current.get(topic);
        if (sub) {
          sub.unsubscribe();
          activeStompSubsRef.current.delete(topic);
        }
      }
    };
  }, []);

  const publish = useCallback((destination: string, body: any) => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish({
        destination,
        body: typeof body === "string" ? body : JSON.stringify(body),
      });
    } else {
      console.warn("WebSocket is not connected. Message dropped:", destination, body);
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, publish }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function useStompTopic<T = any>(
  topic: string | null | undefined,
  onMessage: (data: T, rawMessage: IMessage) => void
) {
  const { subscribe, isConnected } = useWebSocket();
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!topic) return;

    const unsubscribe = subscribe(topic, (rawMessage) => {
      try {
        const parsed = JSON.parse(rawMessage.body);
        onMessageRef.current(parsed, rawMessage);
      } catch (err) {
        onMessageRef.current(rawMessage.body as any, rawMessage);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [topic, subscribe]);

  return { isConnected };
}
