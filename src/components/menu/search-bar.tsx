import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
export default function SearchBar() {
  return (
    <Field className="w-100">
      <div
        className="group flex h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4
                   transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
                   hover:border-gray-400"
      >
        <Input
          id="input-button-group"
          placeholder="Type to search..."
          className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <SearchIcon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-primary" />
      </div>
    </Field>
  );
}