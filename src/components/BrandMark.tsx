import type { ImgHTMLAttributes } from "react";

/** Served from `/public/brand-logo.png` — overwrite that file to update the mark. */
const BRAND_LOGO_SRC = "/brand-logo.png";

export function BrandMark(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { className, alt = "", decoding = "async", ...rest } = props;
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={alt}
      className={className}
      width={76}
      height={76}
      decoding={decoding}
      {...rest}
    />
  );
}
