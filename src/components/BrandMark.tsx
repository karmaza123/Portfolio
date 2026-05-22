import type { ImgHTMLAttributes } from "react";

/** Served from `/public/brand-mark.svg` — replace that file to update the mark. */
const BRAND_MARK_SRC = "/brand-mark.svg";

export function BrandMark(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { className, alt = "", decoding = "async", ...rest } = props;
  return (
    <img
      src={BRAND_MARK_SRC}
      alt={alt}
      className={className}
      width={76}
      height={76}
      decoding={decoding}
      {...rest}
    />
  );
}
