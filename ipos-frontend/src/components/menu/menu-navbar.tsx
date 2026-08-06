import Image from "next/image";

import SearchBar from "./search-bar";

export default function MenuNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Image
          src="https://i.pinimg.com/1200x/f3/55/fe/f355fe7920728c3c154345655100f4ee.jpg"
          width={44}
          height={44}
          alt="shop logo"
          className="h-11 w-11 rounded-xl object-cover shadow-sm ring-1 ring-black/5"
        />
        <SearchBar />
      </div>
    </header>
  );
}