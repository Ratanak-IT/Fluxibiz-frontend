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
]





