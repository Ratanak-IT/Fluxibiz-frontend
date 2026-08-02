
import { SECURITY_FEATURES } from "@/lib/privacy/privacy-content";


export function SecurityFeatures() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SECURITY_FEATURES.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="rounded-xl border border-gray-200 bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-[#2D2D2D] dark:bg-[#121212]"
        >
          <span
            className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#00932A]/10 text-[#00932A] dark:bg-[#21B94B]/10 dark:text-[#21B94B]"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="mb-1 font-bold tracking-tight text-gray-900 dark:text-[#F5F5F5]">
            {title}
          </h3>
          <p className="text-sm leading-[1.8] text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}
