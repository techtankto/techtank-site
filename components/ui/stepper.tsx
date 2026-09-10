import { forwardRef, type HTMLAttributes } from "react";
import { cn, cva, type VariantProps } from "@/utils/theme";

const styles = {
  // A description list, not headings: each step is a title paired with its
  // description, which `dt`/`dd` model directly. Headings would have to invent a
  // level below the section's own, which is what produced the h2-to-h4 jump.
  root: cva("grid gap-6"),
  step: cva("relative"),
  marker: cva(
    "mb-4 flex size-10 items-center justify-center rounded-full bg-ring font-semibold text-primary-foreground",
  ),
  title: cva("mb-1 font-semibold text-foreground"),
  description: cva("text-sm text-muted-foreground"),
};

interface Step {
  title: string;
  description: string;
}

type StepperRef = HTMLDListElement;
type StepperProps = HTMLAttributes<StepperRef> &
  VariantProps<typeof styles.root> & {
    steps: Step[];
  };

const Stepper = forwardRef<StepperRef, StepperProps>((props, ref) => {
  // props
  const { steps, className, ...rest } = props;

  // jsx
  return (
    <dl ref={ref} className={cn(styles.root({ className }))} {...rest}>
      {steps.map((step, index) => (
        <div key={step.title} className={cn(styles.step())}>
          <div className={cn(styles.marker())} aria-hidden="true">
            {index + 1}
          </div>
          <dt className={cn(styles.title())}>{step.title}</dt>
          <dd className={cn(styles.description())}>{step.description}</dd>
        </div>
      ))}
    </dl>
  );
});
Stepper.displayName = "Stepper";

export { Stepper };
export type { Step, StepperProps, StepperRef };
