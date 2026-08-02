// import { COMPANY_NAME } from "@/lib/privacy/privacy-content";
// import Link from "next/link";


// const FOOTER_LINKS = [
//   { label: "Privacy Policy", href: "/privacy-policy" },
//   { label: "Terms of Service", href: "/terms-of-service" },
//   { label: "Cookie Policy", href: "/cookie-policy" },
//   { label: "Contact", href: "/contact" },
// ];

// export function PrivacyFooter() {
//   return (
//     <footer className="border-t border-gray-200 dark:border-[#2D2D2D]">
//       <div className="mx-auto max-w-[900px] px-6 py-8">
//         <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
//           <nav aria-label="Footer">
//             <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
//               {FOOTER_LINKS.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="transition-colors hover:text-[#00932A] dark:hover:text-[#21B94B]"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//           <p className="text-sm text-gray-400 dark:text-gray-500">
//             &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
