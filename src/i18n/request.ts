import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const supportedLocales = ["en", "km"] as const;

export type SupportedLocale =
  (typeof supportedLocales)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const savedLocale =
    cookieStore.get("NEXT_LOCALE")?.value;

  const locale: SupportedLocale =
    savedLocale === "km" ? "km" : "en";

  return {
    locale,
    messages: (
      await import(`../lib/i18n/${locale}.json`)
    ).default,
  };
});