// store card
export interface StoreCardData {
  image: string
  category: string
  name: string
  location: string
  hours: string
}

export const mockStore: StoreCardData = {
  image:
    "https://www.koithe.com/en/images/a-event-7.jpg",
  category: "Milk Tea",
  name: "The KOI",
  location: "Boeng Keng Kang 1",
  hours: "07:00 AM – 10:00 PM",
}