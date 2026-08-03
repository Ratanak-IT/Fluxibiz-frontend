
'use client'

import {
  Info,
  Database,
  Settings,
  Cookie,
  Share2,
  ShieldCheck,
  Archive,
  ScaleIcon,
  Globe,
  Store,
  Package,
  MessageCircle,
  Bot,
  Baby,
  FileText,
  Mail,
} from "lucide-react";

import { PrivacyHero } from "@/components/privacy/privacy-hero";

import { PolicyList, PolicySection } from "@/components/privacy/policy-section";
import { InfoCollectionGrid } from "@/components/privacy/info-collection-grid";
import { SecurityFeatures } from "@/components/privacy/security-features";
import { UserRightsGrid } from "@/components/privacy/user-rights-grid";
import { ContactCard } from "@/components/privacy/contact-card";

import { COMPANY_NAME, MARKETPLACE_FEATURES, POS_DATA_POINTS, SOCIAL_CHANNELS, SOCIAL_DATA_POINTS } from "@/lib/privacy/privacy-content";


export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white dark:bg-background">
      <PrivacyHero />

      <main className="mx-auto flex max-w-6xl gap-8 px-6 py-12">
      
        <div className="mx-auto w-full max-w-[900px] space-y-6">
          <PolicySection id="introduction" icon={Info} title="Introduction">
            <p>
              {COMPANY_NAME} provides commerce tools that help
              businesses sell in person, online, and through chat. This policy describes
              what information we collect when you use our marketplace, point-of-sale
              software, and connected messaging channels, why we collect it, and the
              choices you have.
            </p>
            <p>
              By using our products, you agree to the collection and use of information
              in line with this policy. If you do not agree with any part of it, please
              do not use our services.
            </p>
          </PolicySection>

          <PolicySection id="information-we-collect" icon={Database} title="Information We Collect">
            <p>
              We collect information that you provide directly, information generated
              automatically as you use our products, and information created through
              connected sales and messaging channels.
            </p>
            <InfoCollectionGrid />
          </PolicySection>

          <PolicySection id="how-we-use-information" icon={Settings} title="How We Use Information">
            <p>We use the information we collect to:</p>
            <PolicyList
              items={[
                "Provide, operate, and maintain our marketplace and POS services",
                "Process transactions and send related confirmations",
                "Personalize product recommendations and search results",
                "Detect, investigate, and prevent fraudulent or unauthorized activity",
                "Improve our products through aggregated usage analysis",
                "Communicate updates, security alerts, and support messages",
              ]}
            />
          </PolicySection>

          <PolicySection id="cookies" icon={Cookie} title="Cookies">
            <p>
              We use cookies and similar technologies to keep you signed in, remember
              preferences, and understand how our products are used. You can control
              cookies through your browser settings; disabling them may limit some
              features.
            </p>
            <PolicyList
              items={[
                "Essential cookies — required for login and checkout to function",
                "Preference cookies — remember settings like language and theme",
                "Analytics cookies — help us understand product usage in aggregate",
              ]}
            />
          </PolicySection>

          <PolicySection id="sharing-information" icon={Share2} title="Sharing Information">
            <p>
              We do not sell your personal information. We share it only in the
              following circumstances:
            </p>
            <PolicyList
              items={[
                "With payment processors to complete transactions",
                "With service providers who support hosting, analytics, and support",
                "With sellers, when you place an order through their store",
                "When required by law, regulation, or valid legal process",
                "With your consent, or at your direction",
              ]}
            />
          </PolicySection>

          <PolicySection id="data-security" icon={ShieldCheck} title="Data Security">
            <p>
              We apply industry-standard safeguards to protect your information against
              unauthorized access, alteration, disclosure, or destruction.
            </p>
            <SecurityFeatures />
          </PolicySection>

          <PolicySection id="data-retention" icon={Archive} title="Data Retention">
            <p>
              We retain personal information for as long as your account is active or
              as needed to provide our services. We may retain and use information as
              necessary to comply with legal obligations, resolve disputes, and enforce
              our agreements. When data is no longer needed, we securely delete or
              anonymize it.
            </p>
          </PolicySection>

          <PolicySection id="user-rights" icon={ScaleIcon} title="User Rights">
            <p>
              Depending on where you live, you may have the following rights over your
              personal information:
            </p>
            <UserRightsGrid />
            <p>
              To exercise any of these rights, contact us using the details in the{" "}
              <a href="#contact-us" className="font-medium text-[#00932A] underline underline-offset-4 dark:text-[#21B94B]">
                Contact Us
              </a>{" "}
              section below.
            </p>
          </PolicySection>

          <PolicySection id="third-party-services" icon={Globe} title="Third-Party Services">
            <p>
              Our products integrate with third-party services such as payment
              processors, shipping carriers, and messaging platforms. These providers
              have their own privacy policies, and we encourage you to review them. We
              share only the information necessary for these integrations to function.
            </p>
          </PolicySection>

          <PolicySection id="marketplace" icon={Store} title="Marketplace">
            <p>Our marketplace lets customers:</p>
            <ul className="space-y-3">
              {MARKETPLACE_FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00932A]/10 text-[#00932A] dark:bg-[#21B94B]/10 dark:text-[#21B94B]"
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p>
              We collect the information needed to power these features, including
              browsing activity, order history, and account preferences.
            </p>
          </PolicySection>

          <PolicySection id="pos-system" icon={Package} title="POS System">
            <p>
              Our point-of-sale software collects operational data that sellers need to
              run their business, including:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {POS_DATA_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00932A]/10 text-[#00932A] dark:bg-[#21B94B]/10 dark:text-[#21B94B]"
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection id="social-commerce" icon={MessageCircle} title="Social Commerce">
            <p>We integrate with several messaging platforms to support chat-based selling:</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SOCIAL_CHANNELS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-[#2D2D2D] dark:bg-[#121212]"
                >
                  <span
                    className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#00932A]/10 text-[#00932A] dark:bg-[#21B94B]/10 dark:text-[#21B94B]"
                    aria-hidden="true"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="font-bold tracking-tight text-gray-900 dark:text-[#F5F5F5]">
                    {title}
                  </h3>
                  <p className="text-sm leading-[1.8] text-gray-600 dark:text-gray-300">
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <p>Through these channels, we collect:</p>
            <PolicyList items={SOCIAL_DATA_POINTS} />
          </PolicySection>

          <PolicySection id="telegram-chatbot" icon={Bot} title="Telegram Chatbot">
            <p>
              Our Telegram bot lets customers browse products, place orders, and get
              support without leaving the app. When you interact with the bot, we
              collect your Telegram user ID, username, and message content needed to
              respond to your request. We do not access your broader Telegram contacts
              or conversations outside the bot.
            </p>
          </PolicySection>

          <PolicySection id="childrens-privacy" icon={Baby} title="Children's Privacy">
            <p>
              Our services are not directed to children under 13, and we do not
              knowingly collect personal information from them. If we learn that a
              child has provided us with personal information, we will delete it
              promptly. Parents who believe their child has shared information with us
              can contact us to request removal.
            </p>
          </PolicySection>

          <PolicySection id="changes-to-policy" icon={FileText} title="Changes to Policy">
            <p>
              We may update this policy from time to time to reflect changes in our
              practices or for legal, operational, or regulatory reasons. We will post
              the updated policy here with a revised Last updated date, and for
              material changes, we will provide additional notice such as an email or
              in-product message.
            </p>
          </PolicySection>

          <PolicySection id="contact-us" icon={Mail} title="Contact Us">
            <p>
              If you have questions about this policy or how we handle your
              information, reach out to our privacy team:
            </p>
            <ContactCard />
          </PolicySection>
        </div>
      </main>

      {/* <PrivacyFooter /> */}
    </div>
  );
}
