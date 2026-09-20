import Image from "next/image";
import { getAllTools, type Tool } from "@/constants/tools";

const tools = getAllTools();

function ToolLogo({ tool }: { tool: Tool }) {
  return (
    <Image
      src={tool.logo}
      alt={`${tool.name} logo`}
      width={tool.width}
      height={tool.height}
      className="object-contain opacity-80 transition-opacity group-hover:opacity-100 dark:brightness-0 dark:invert"
      style={{
        width: "auto",
        height: `calc(var(--logo-height) * ${tool.scale ?? 1})`,
      }}
    />
  );
}

/** Card grid for the sponsor page — each tool's wordmark with what it does and how volunteers use it. */
export function ToolsGrid({ className }: { className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className ?? ""}`}>
      {tools.map((tool) => (
        <a
          key={tool.id}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          title={tool.name}
          className="group rounded-2xl border border-border bg-card p-6 transition-colors [--logo-height:1.75rem] hover:border-ring/50"
        >
          <div className="mb-4 flex h-8 items-center">
            <ToolLogo tool={tool} />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
        </a>
      ))}
    </div>
  );
}

/** Compact logo strip for the homepage. */
export function ToolsStrip({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-6 ${className ?? ""}`}>
      {tools.map((tool) => (
        <a
          key={tool.id}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex shrink-0 items-center justify-center [--logo-height:1.5rem] lg:[--logo-height:1.75rem]"
          title={tool.name}
        >
          <ToolLogo tool={tool} />
        </a>
      ))}
    </div>
  );
}
