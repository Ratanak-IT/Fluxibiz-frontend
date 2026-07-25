// import CategoryFilter from "@/components/menu/category-filter";
// import MenuCard, { PosCardType } from "@/components/menu/menu-card";
// import { div } from "motion/react-client";

// export const MOCK_MENU_ITEMS: PosCardType[] = [
//   {
//     id: 1,
//     name: "Classic Cheeseburger",
//     price: 8.99,
//     image:
//       "https://i.pinimg.com/1200x/e9/7c/c7/e97cc7bfe0f5813c053d6960aaae7424.jpg",
//     category: "Burgers",
//   },
//   {
//     id: 2,
//     name: "Crispy French Fries",
//     price: 3.49,
//     image:
//       "https://i.pinimg.com/1200x/e9/7c/c7/e97cc7bfe0f5813c053d6960aaae7424.jpg",
//     category: "Sides",
//   },
//   {
//     id: 3,
//     name: "Iced Caramel Latte",
//     price: 4.5,
//     image:
//       "https://i.pinimg.com/1200x/7f/cc/bd/7fccbd3580fc74c682fd82df49168712.jpg",
//     category: "Beverages",
//   },
//   {
//     id: 4,
//     name: "Pepperoni Feast Pizza",
//     price: 12.99,
//     image:
//       "https://i.pinimg.com/1200x/e9/7c/c7/e97cc7bfe0f5813c053d6960aaae7424.jpg",
//     category: "Pizza",
//   },
// ];

// export default function MenuPage() {
//   return (
//     <div className="w-full flex  justify-center p-4 sm:p-6">
//       <div>
//         <CategoryFilter />

//         <div className="w-full flex justify-center p-4 sm:p-6">
//           <div className="grid w-full max-w-6xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {MOCK_MENU_ITEMS.map((item) => (
//               <MenuCard
//                 key={item.id}
//                 id={item.id}
//                 name={item.name}
//                 price={item.price}
//                 image={item.image}
//                 category={item.category}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import CategoryFilter from "@/components/menu/category-filter";
import MenuCard, { PosCardType } from "@/components/menu/menu-card";

export const MOCK_MENU_ITEMS: PosCardType[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    price: 8.99,
    image:
      "https://i.pinimg.com/1200x/e9/7c/c7/e97cc7bfe0f5813c053d6960aaae7424.jpg",
    category: "Burgers",
  },
  {
    id: 2,
    name: "Crispy French Fries",
    price: 3.49,
    image:
      "https://i.pinimg.com/1200x/e9/7c/c7/e97cc7bfe0f5813c053d6960aaae7424.jpg",
    category: "Sides",
  },
  {
    id: 3,
    name: "Iced Caramel Latte",
    price: 4.5,
    image:
      "https://i.pinimg.com/1200x/7f/cc/bd/7fccbd3580fc74c682fd82df49168712.jpg",
    category: "Beverages",
  },
  {
    id: 4,
    name: "Pepperoni Feast Pizza",
    price: 12.99,
    image:
      "https://i.pinimg.com/1200x/e9/7c/c7/e97cc7bfe0f5813c053d6960aaae7424.jpg",
    category: "Pizza",
  },
   {
    id: 5,
    name: "Pepperoni Feast Pizza",
    price: 12.99,
    image:
      "https://i.pinimg.com/1200x/e9/7c/c7/e97cc7bfe0f5813c053d6960aaae7424.jpg",
    category: "Pizza",
  },
   {
    id: 6,
    name: "Pepperoni Feast Pizza",
    price: 12.99,
    image:
      "https://i.pinimg.com/1200x/e9/7c/c7/e97cc7bfe0f5813c053d6960aaae7424.jpg",
    category: "Pizza",
  },
];

export default function MenuPage() {
  return (
    <div className="w-full mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <CategoryFilter />
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {MOCK_MENU_ITEMS.map((item) => (
            <MenuCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}