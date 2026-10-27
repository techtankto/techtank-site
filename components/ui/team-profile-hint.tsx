import { cva } from "@/utils/theme";

const styles = {
  root: cva("mt-3 text-xs font-semibold text-ring transition-colors group-hover:text-ring/80"),
};

export function TeamProfileHint() {
  return (
    <p className={styles.root()}>
      View profile <span aria-hidden="true">→</span>
    </p>
  );
}
