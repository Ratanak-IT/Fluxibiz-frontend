
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormValues, contactSchema } from "@/lib/about/contact-schema";

export  default function ContactSection() {
  const t = useTranslations("Support.contact");

  const contactDetails = [
    {
      icon: MapPin,
      label: t("details.visit"),
      value:
        "#40, Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork, Phnom Penh",
    },
    {
      icon: Mail,
      label: t("details.email"),
      value: "ipos.stad@gmail.com",
    },
    {
      icon: Phone,
      label: t("details.call"),
      value: "+855 15 33 88 26",
    },
    {
      icon: Send,
      label: t("details.telegram"),
      value: "@ipos_team",
    },
  ];

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: ContactFormValues) {
    // TODO: wire up to your API (for example, an RTK Query mutation).
    console.log(values);
    form.reset();
  }

  return (
    <section className="bg-background py-20 font-body dark:bg-background">
      <div className="mx-auto grid max-w-[1900px] gap-10 px-[5.5%] lg:grid-cols-2 lg:gap-12">
        {/* Left: heading + contact details */}
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary dark:text-green-400">
            {t("eyebrow")}
          </p>

          <h2 className="mt-3 font-body text-3xl font-bold tracking-tight text-primary sm:text-4xl dark:text-green-400">
            {t("title")}
          </h2>

          <p className="mt-3 max-w-md font-body text-sm text-neutral-600 sm:text-base dark:text-gray-300">
            {t("description")}
          </p>

          <div className="mt-8 space-y-4">
            {contactDetails.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs transition-colors dark:border-neutral-800 dark:bg-card"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
                  <Icon className="h-5 w-5 text-primary dark:text-green-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-green-400">
                    {label}
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-800 dark:text-gray-200">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8 dark:border-neutral-800 dark:bg-card">
          <h3 className="font-body text-lg font-semibold text-neutral-900 dark:text-white">
            {t("form.title")}
          </h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700 dark:text-gray-300">
                        {t("form.nameLabel")}
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder={t("form.namePlaceholder")}
                          className="h-10 dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-neutral-700 dark:text-gray-300">
                        {t("form.emailLabel")}
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("form.emailPlaceholder")}
                          className="h-10 dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700 dark:text-gray-300">
                      {t("form.subjectLabel")}
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder={t("form.subjectPlaceholder")}
                        className="h-10 dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700 dark:text-gray-300">
                      {t("form.messageLabel")}
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder={t("form.messagePlaceholder")}
                        className="resize-none dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-primary px-6 text-white hover:bg-green-700 dark:bg-primary dark:text-white dark:hover:bg-green-600"
              >
                {t("form.submit")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}