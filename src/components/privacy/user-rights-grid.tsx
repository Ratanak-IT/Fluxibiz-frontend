import { USER_RIGHTS } from "@/lib/privacy/privacy-content";


export function UserRightsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {USER_RIGHTS.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-card dark:bg-background"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00932A]/10 text-[#00932A] dark:bg-[#21B94B]/10 dark:text-[#21B94B]"
            aria-hidden="true"
          >
            <Icon className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="font-bold tracking-tight text-gray-900 dark:text-[#F5F5F5]">
              {title}
            </h3>
            <p className="text-sm leading-[1.8] text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
