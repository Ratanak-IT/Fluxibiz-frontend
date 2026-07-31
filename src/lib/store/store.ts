// store card
export interface StoreCardData {
  id?: string
  image: string
  category: string
  name: string
  description: string
  location: string
  hours: string
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