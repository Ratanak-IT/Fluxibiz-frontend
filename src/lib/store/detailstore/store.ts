import type { ChannelSchedule } from "@/lib/type/storeType"

// store card
export interface StoreCardData {
  id?: string
  image: string
  category: string
  name: string
  description: string
  location: string
  address?: string | null
  googleMap?: string | null
  phoneNumber?: string | null
  facebookUrl?: string | null
  facebookName?: string | null
  hours: string
  openTime?: string | null
  closeTime?: string | null
  discountLabel?: string | null
  /** Whether the online store is taking orders right now. */
  isOpen?: boolean
  /** The hours the shop set for its Online Store, when it set any. */
  onlineHours?: ChannelSchedule | null
  /** Straight-line distance from the shopper's position; null/undefined unless they shared it. */
  distanceKm?: number | null
}

export const mockStore: StoreCardData = {
  image:
    "https://upload.wikimedia.org/wikipedia/commons/3/3d/Koi_The.jpg",
  category: "Milk Tea",
  name: "The KOI",
  location: "Boeng Keng Kang 1",
  hours: "07:00 AM – 10:00 PM",
  description: "The KOI is a popular milk tea brand known for its high-quality ingredients and unique flavors. They offer a variety of milk tea options, including classic milk tea, fruit-infused teas, and specialty drinks. The KOI is committed to providing a delightful tea experience for its customers."
}