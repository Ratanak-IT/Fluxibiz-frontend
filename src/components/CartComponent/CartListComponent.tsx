import { mockItems } from "@/lib/cart/cart"
import ItemCardComponent from "./ItemCardComponent"


export default function CartList() {
  return (
    <div className="space-y-4">
      {mockItems.map((item) => (
        <ItemCardComponent
          key={item.id}
          item={item}
        />
      ))}
    </div>
  )
}