import { Mail, Phone, MapPin, Clock } from "lucide-react";

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "ipos.istad@gmail.com",
    href: "mailto:privacy@northbeam.io",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+885 15 33 88 26",
    href: "tel:+885 15 33 88 26",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "40 Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork, Phnom Penh",

  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Monday – Friday, 9:00 AM – 6:00 PM (PT)",
  },
];

export function ContactCard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
        <div
          key={label}
          className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-card dark:bg-background"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00932A]/10 text-primary dark:bg-[#21B94B]/10 dark:text-[#21B94B]"
            aria-hidden="true"
          >
            <Icon className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {label}
            </p>
            {href ? (
              <a
                href={href}
                className="font-medium text-gray-900 underline-offset-4 hover:text-[#00932A] hover:underline dark:text-text dark:hover:text-[#21B94B]"
              >
                {value}
              </a>
            ) : (
              <p className="font-medium text-gray-900 dark:text-[#F5F5F5]">{value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
