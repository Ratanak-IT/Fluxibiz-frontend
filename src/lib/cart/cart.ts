
// item card
export default interface ItemCardData {
  id: number
  image: string
  name: string
  title: string
  description: string
  badges: string[]
  quantity: number
  price: number
}


export const mockItems: ItemCardData[] = [
  {
    id: 1,
    image:
      "https://i.pinimg.com/736x/25/17/98/2517984ee7203b9bdda04cd4a78525fd.jpg",
    title: "KFC Signature Burger",
    description: "Beef patty, crispy bacon, cheddar, ...",
    badges: ["No onions", "Extra cheese", "size s"],
    quantity: 1,
    price: 18.5,
    name: "KFC Signature Burger"
  },
  {
    id: 2,
    image:
      "https://i.pinimg.com/736x/0d/54/e0/0d54e01fbce989f17d836b3bc59a2fed.jpg",
    title: "kentucky fried chicken ",
    description: "Beef patty, crispy bacon, cheddar, ...",
    badges: ["No onions", "Extra cheese", "size s"],
    quantity: 1,
    price: 18.5,
    name: "Kentucky Fried Chicken"
  }
  // {
  //   id: 3,
  //   image:
  //     "https://i.pinimg.com/736x/62/07/01/620701147f4cefd9d14fb91657601c31.jpg",
  //   title: "Fried fries ",
  //   description: "Photo culinary magazine photo of french ... ",
  //   badges: [ "size s"],
  //   quantity: 1,
  //   price: 2.5,
  //   name: "Fried fries"
  // }
]


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
    "https://i.pinimg.com/control1/1200x/3a/63/13/3a63135dd9749486af01c7acdb321c5e.jpg",
  category: "Fast Food",
  name: "KFC Cambodia",
  location: "Boeng Keng Kang 1",
  hours: "07:00 AM – 10:00 PM",
}




