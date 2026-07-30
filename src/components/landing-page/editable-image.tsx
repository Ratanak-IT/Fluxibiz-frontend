import { existsSync } from "node:fs";
import { join } from "node:path";
import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";

interface EditableImageProps extends Omit<ImageProps, "src"> {
  src: string;
  label: string;
}

/** Server-only image helper that shows the expected path until an asset is added. */
export function EditableImage({
  src,
  label,
  fill,
  width,
  height,
  alt,
  className,
  ...props
}: EditableImageProps) {
  const isRemote = /^https?:\/\//.test(src);
  const publicPath = isRemote
    ? null
    : join(process.cwd(), "public", src.replace(/^\//, ""));

  if (isRemote || (publicPath && existsSync(publicPath))) {
    return (
      <Image
        src={src}
        fill={fill}
        width={width}
        height={height}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  return (
    <span
      className={`${fill ? "absolute inset-0" : "inline-flex"} flex items-center justify-center bg-brand-soft p-4 text-center text-brand-ink`}
      style={!fill ? { width, height } : undefined}
      role="img"
      aria-label={`${label} placeholder`}
    >
      <span className="flex max-w-48 flex-col items-center gap-2">
        <ImageIcon className="size-8 text-brand" aria-hidden />
        <span className="text-xs font-semibold">{label}</span>
        <code className="break-all text-[10px] text-muted-foreground">{src}</code>
      </span>
    </span>
  );
}
