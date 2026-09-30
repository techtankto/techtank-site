import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn, cva, type VariantProps } from "@/utils/theme";

const styles = {
  root: cva(
    "w-full resize-y rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  ),
};

type TextareaRef = HTMLTextAreaElement;
type TextareaProps = TextareaHTMLAttributes<TextareaRef> & VariantProps<typeof styles.root>;

const Textarea = forwardRef<TextareaRef, TextareaProps>((props, ref) => {
  // props
  const { className, rows = 4, ...rest } = props;

  // jsx
  return <textarea ref={ref} rows={rows} className={cn(styles.root({ className }))} {...rest} />;
});
Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps, TextareaRef };
