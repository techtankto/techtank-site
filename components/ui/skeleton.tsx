import { forwardRef, type HTMLAttributes } from "react";
import { cn, cva, type VariantProps } from "@/utils/theme";

const styles = {
  root: cva("block animate-pulse rounded-md bg-muted motion-reduce:animate-none"),
};

type SkeletonRef = HTMLDivElement;
type SkeletonProps = HTMLAttributes<SkeletonRef> & VariantProps<typeof styles.root>;

/**
 * A single pulsing placeholder block. Size and shape come from
 * `className` at the call site (`h-*`, `w-*`, `rounded-*`), so one
 * primitive covers text lines, chips, avatars and buttons. Decorative
 * by design: the loading state is announced once by its container.
 */
const Skeleton = forwardRef<SkeletonRef, SkeletonProps>((props, ref) => {
  // props
  const { className, ...rest } = props;

  // jsx
  return <div ref={ref} aria-hidden className={cn(styles.root({ className }))} {...rest} />;
});
Skeleton.displayName = "Skeleton";

export { Skeleton };
export type { SkeletonProps, SkeletonRef };
