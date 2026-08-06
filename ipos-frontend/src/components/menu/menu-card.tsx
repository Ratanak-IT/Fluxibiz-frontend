import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export interface PosCardType {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}
// export default function MenuCard({
//   name,
//   price,
//   image,
//   category,
// }: PosCardType) {
//   return (
//     <Card className="w-60 pt-0">
//       <CardContent className="px-0 rounded-2xl ">
//         <img
//           src={image}
//           alt="Banner"
//           className="aspect-video h-60 rounded-2xl border border-white object-cover"
//         />
//       </CardContent>

//       <CardHeader>
//         <p className="text-gray-500">{category}</p>
//         <CardTitle className="text-gray-500 font-semibold line-clamp-1">
//           {name}
//         </CardTitle>
//         <CardTitle className="text-accent font-bold">${price}</CardTitle>
//       </CardHeader>
//     </Card>
//   );
// }
export default function MenuCard({
  name,
  price,
  image,
  category,
}: PosCardType) {
  return (
    <Card className="w-full pt-0">
      <CardContent className="px-0 rounded-full">
        <Image
          src={image}
          alt={name}
          height={100}
          width={100}
            className="aspect-square w-full rounded-5xl border border-white object-cover"
        />
      </CardContent>

      <CardHeader>
        <p className="text-gray-500">{category}</p>
        <CardTitle className="text-gray-500 font-semibold line-clamp-1">
          {name}
        </CardTitle>
        <CardTitle className="text-accent font-bold">${price}</CardTitle>
      </CardHeader>
    </Card>
  );
}