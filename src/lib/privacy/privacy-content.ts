import {
  ShieldCheck,
  Lock,
  User,
  Store,
  ShoppingCart,
  Package,
  Database,
  CreditCard,
  Cookie,
  Bot,
  MessageCircle,
  Globe,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  Smartphone,
  Users,
  BarChart3,
  KeyRound,
  Server,
  ShieldAlert,
  Download,
  Trash2,
  Pencil,
  XCircle,
  Share2,
  type LucideIcon,
} from "lucide-react";



export const LAST_UPDATED = "August 1, 2026";
export const COMPANY_NAME = "FluxiBiz";

export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "introduction", label: "Introduction" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-information", label: "How We Use Information" },
  { id: "cookies", label: "Cookies" },
  { id: "sharing-information", label: "Sharing Information" },
  { id: "data-security", label: "Data Security" },
  { id: "data-retention", label: "Data Retention" },
  { id: "user-rights", label: "User Rights" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "marketplace", label: "Marketplace" },
  { id: "pos-system", label: "POS System" },
  // { id: "social-commerce", label: "Social Commerce" },
  { id: "telegram-chatbot", label: "Telegram Chatbot" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "changes-to-policy", label: "Changes to Policy" },
  { id: "contact-us", label: "Contact Us" },
];

export interface InfoCard {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
}

export const INFORMATION_CARDS: InfoCard[] = [
  {
    icon: User,
    title: "Personal Information",
    description: "Details you give us directly when you create or manage an account.",
    points: [
      "Full name and username",
      "Email address and phone number",
      "Billing and shipping address",
      "Profile photo, if you add one",
    ],
  },
  {
    icon: Store,
    title: "Store Information",
    description: "Details about the businesses you register or manage on our platform.",
    points: [
      "Business name and category",
      "Store logo and branding assets",
      "Business address and tax details",
      "Staff roles and permissions",
    ],
  },
  {
    icon: CreditCard,
    title: "Transaction Information",
    description: "Records generated whenever a purchase or payment takes place.",
    points: [
      "Order and invoice history",
      "Payment method type (we don't store full card numbers)",
      "Refunds, discounts, and promotions applied",
      "Currency and tax calculations",
    ],
  },
  {
    icon: Package,
    title: "POS Data",
    description: "Operational data created through your point-of-sale activity.",
    points: [
      "Product catalog and pricing",
      "Inventory counts and stock movements",
      "Shift, till, and receipt records",
      "Employee sales performance",
    ],
  },
  {
    icon: Smartphone,
    title: "Device Information",
    description: "Technical details collected automatically to keep the service secure and reliable.",
    points: [
      "Device type, OS, and browser version",
      "IP address and approximate location",
      "App version and crash diagnostics",
      "Session timestamps and log data",
    ],
  },
  {
    icon: MessageCircle,
    title: "Social Commerce Data",
    description: "Information exchanged through connected chat and messaging channels.",
    points: [
      "Chat conversations with customers",
      "Product inquiries and order requests",
      "Contact identifiers used by the channel",
      "Support ticket history",
    ],
  },
];

export interface SecurityFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const SECURITY_FEATURES: SecurityFeature[] = [
  {
    icon: Lock,
    title: "Encryption",
    description: "Data is encrypted in transit with TLS 1.2+ and at rest using AES-256.",
  },
  {
    icon: ShieldCheck,
    title: "Authentication",
    description: "Multi-factor authentication and secure session management protect every account.",
  },
  {
    icon: Server,
    title: "Secure Storage",
    description: "Production data lives in access-controlled, continuously monitored cloud infrastructure.",
  },
  {
    icon: KeyRound,
    title: "Access Control",
    description: "Role-based permissions ensure staff only see the data required for their job.",
  },
  {
    icon: Database,
    title: "Backup",
    description: "Automated, encrypted backups run daily with tested disaster-recovery procedures.",
  },
  {
    icon: BarChart3,
    title: "Monitoring",
    description: "24/7 automated monitoring and audit logging flag unusual activity in real time.",
  },
];

export interface RightCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const USER_RIGHTS: RightCard[] = [
  {
    icon: FileText,
    title: "Access Data",
    description: "Request a copy of the personal data we hold about you.",
  },
  {
    icon: Pencil,
    title: "Correct Information",
    description: "Ask us to fix inaccurate or incomplete information on file.",
  },
  {
    icon: Trash2,
    title: "Delete Account",
    description: "Request deletion of your account and associated personal data.",
  },
  {
    icon: Download,
    title: "Download Data",
    description: "Export your data in a portable, machine-readable format.",
  },
  {
    icon: XCircle,
    title: "Withdraw Consent",
    description: "Opt out of optional processing, such as marketing communications, at any time.",
  },
];

export const MARKETPLACE_FEATURES = [
  { icon: Store, text: "Browse stores and discover new sellers near them" },
  { icon: ShoppingCart, text: "Purchase products directly through the marketplace" },
  { icon: Package, text: "Track orders from checkout to delivery" },
  { icon: User, text: "Manage their account, addresses, and saved payment methods" },
  { icon: BarChart3, text: "Receive personalized product recommendations" },
];

export const POS_DATA_POINTS = [
  { icon: Package, text: "Products and pricing catalogs" },
  { icon: Database, text: "Inventory counts and stock movements" },
  { icon: CreditCard, text: "Sales transactions and payment records" },
  { icon: Users, text: "Employee accounts and shift activity" },
  { icon: User, text: "Customer profiles linked to purchases" },
  { icon: BarChart3, text: "Sales and performance reports" },
  { icon: FileText, text: "Digital and printed receipts" },
];

export const SOCIAL_CHANNELS = [
  { icon: Bot, title: "Telegram Bot", description: "Automated ordering and support through Telegram." },
  { icon: MessageCircle, title: "Messenger", description: "Facebook Messenger integration for customer chat." }
];

export const SOCIAL_DATA_POINTS = [
  "Order requests submitted through chat",
  "Product inquiries and availability questions",
  "Customer support conversations and resolutions",
];

export { Cookie, ShieldAlert, Share2, Mail, Phone, MapPin, Clock };
