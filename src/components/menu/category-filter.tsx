// "use client";

// import { useState } from "react";

// const CATEGORIES = [
//   "All Category",
//   "Sneakers",
//   "Sports Shoes",
//   "Boots",
//   "Slippers",
//   "Heels",
//   "Kids' Shoes",
//   "Casual",
//   "Drink",
//   "Food",
//   "Clothes",
//   "Electronic",
//   "Hot Drink",
//   "Cold Drink"
// ];

// type CategoryFilterProps = {
//   onChange?: (category: string) => void;
// };

// export default function CategoryFilter({ onChange }: CategoryFilterProps) {
//   const [active, setActive] = useState("All Category");

//   const handleSelect = (category: string) => {
//     setActive(category);
//     onChange?.(category);
//   };

//   return (
//     <div className="category-scroll snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none]  [&::-webkit-scrollbar]:hidden flex w-full gap-3  overflow-x-auto px-6 py-4">
//       {CATEGORIES.map((category) => {
//         const isActive = category === active;
//         return (
//           <button
//             key={category}
//             type="button"
//             onClick={() => handleSelect(category)}
//             className={`shrink-0 rounded-xl border px-5 py-2 text-sm font-medium transition-colors ${
//               isActive
//                 ? "border-primary bg-primary text-white"
//                 : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
//             }`}
//           >
//             {category}
//           </button>
//         );
//       })}
//     </div>
//   );
// }
"use client";

import { useState } from "react";

const CATEGORIES = [
  "All Category",
  "Sneakers",
  "Sports Shoes",
  "Boots",
  "Slippers",
  "Heels",
  "Kids' Shoes",
  "Casual",
  "Drink",
  "Food",
  "Clothes",
  "Electronic",
  "Hot Drink",
  "Cold Drink"
];

type CategoryFilterProps = {
  onChange?: (category: string) => void;
};

export default function CategoryFilter({ onChange }: CategoryFilterProps) {
  const [active, setActive] = useState("All Category");

  const handleSelect = (category: string) => {
    setActive(category);
    onChange?.(category);
  };

  return (
    <div className="category-scroll sticky top-20 z-40 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none]  [&::-webkit-scrollbar]:hidden flex w-full gap-3 bg-background overflow-x-auto px-6 py-4">
      {CATEGORIES.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            onClick={() => handleSelect(category)}
            className={`shrink-0 rounded-xl border px-5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-primary bg-primary text-white"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}