import { mockItems } from "@/lib/cart/cart"
import ItemCardComponent from "./item-card-component"



export default function CartList() {
  return (
<div className="space-y-2 sm:space-y-3">
      {mockItems.map((item) => (
        <ItemCardComponent
          key={item.id}
          item={item}
        />
      ))}
 
 
    </div>
  )
}