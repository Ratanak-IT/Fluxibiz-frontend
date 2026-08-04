import { INFORMATION_CARDS } from "@/lib/privacy/privacy-content";


export function InfoCollectionGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {INFORMATION_CARDS.map(({ icon: Icon, title, description, points }) => (
        <div
          key={title}
          className="group rounded-xl  border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-card dark:bg-background"
        >
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FEB90D]/15 text-[#946200] dark:bg-[#F5B91B]/15 dark:text-[#F5B91B]"
              aria-hidden="true"
            >
              <Icon className="h-4.5 w-4.5" />
            </span>
            <h3 className="font-bold tracking-tight text-gray-900 dark:text-[#F5F5F5]">
              {title}
            </h3>
          </div>
          <p className="mb-3 text-base leading-[1.8] text-gray-600 dark:text-gray-300">
            {description}
          </p>
          <ul className="space-y-1.5">
            {points.map((point) => (
              <li key={point} className="flex gap-2 text-base text-gray-600 dark:text-gray-300">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400 dark:bg-gray-500"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
