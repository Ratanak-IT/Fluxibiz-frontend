"use client";

import { useIsTma } from "@/lib/tma/useIsTma";
import { useIsMessenger } from "@/lib/tma/useIsMessenger";


export function useMiniAppMode(): { isMiniApp: boolean; queryParam: string } {
  const isTma = useIsTma();
  const isMessenger = useIsMessenger();

  return {
    isMiniApp: isTma || isMessenger,
    queryParam: isTma ? "tma=true" : isMessenger ? "messenger=true" : "",
  };
}
