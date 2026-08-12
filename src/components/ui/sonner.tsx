"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            style={{
                top: "80px",
                "--toast-close-button-start": "unset",
                "--toast-close-button-end": "0",
                "--toast-close-button-transform": "translate(35%, -35%)",
            } as React.CSSProperties}
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium",
                    closeButton:
                        "group-[.toast]:left-auto group-[.toast]:right-0 group-[.toast]:translate-x-1/3 group-[.toast]:-translate-y-1/3",
                },
            }}
            richColors
            closeButton
            position="top-right"
            {...props}
        />
    );
};

export { Toaster, toast };
