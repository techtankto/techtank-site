import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Markdown element styling, keyed with semantic tokens so a task body
// reads like the rest of the site in both themes.
const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="mt-6 mb-3 font-display text-2xl font-semibold text-foreground">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-6 mb-3 font-display text-xl font-semibold text-foreground">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-5 mb-2 font-display text-lg font-semibold text-foreground">{children}</h3>,
  p: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-1.5 text-muted-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-muted-foreground">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-ring underline">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{children}</code>
  ),
};

interface ContributionMarkdownProps {
  content: string;
}

/**
 * Renders a task's markdown body. Shared by the public task page and
 * the admin editor's preview, so what an organizer previews is exactly
 * what ships.
 */
export function ContributionMarkdown({ content }: ContributionMarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
      {content}
    </ReactMarkdown>
  );
}
