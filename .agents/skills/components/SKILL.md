---
name: components
description: House style for authoring, shaping, and styling React/shadcn components (file skeleton, CVA variants, this repo's flat ui/layout organization, layout shell). Use when adding, refactoring, or reviewing a component in this project.
---

# Components

How components are added, shaped, styled, and organized. This skill owns authoring and styling rules; what components exist and what they look like is the design contract's concern, not this skill's.

## The flow: shadcn first

1. **Check shadcn before writing anything.** Primitives use shadcn, which uses Radix primitives underneath. Adding a new component starts with a check of the shadcn library: if it exists there, import it with the CLI (`pnpm dlx shadcn@latest add <name>`), then **reformat it to the house shape below and re-theme it with the project's design tokens**.
2. **Custom components use the identical shape.** If shadcn doesn't have it (or the design calls for something bespoke), author it from scratch in exactly the same format; the only difference is there's nothing to import.

## The file shape

1. **Every component follows this example skeleton:**

   ```tsx
   import { forwardRef, type HTMLAttributes } from 'react'
   import { cn, cva, VariantProps } from '@/utils/theme'

   const styles = {
     root: cva('…', { variants: { … }, defaultVariants: { … } })
   }

   type ExampleRef = HTMLDivElement
   type ExampleProps = HTMLAttributes<ExampleRef> & VariantProps<typeof styles.root>

   const Example = forwardRef<ExampleRef, ExampleProps>((props, ref) => {
     // props
     const { className, ...rest } = props

     // hooks

     // render vars

     // jsx
     return <div ref={ref} className={cn(styles.root({ className }))} {...rest}></div>
   })
   Example.displayName = 'Example'

   export { Example }
   export type { ExampleProps, ExampleRef }
   ```

   Order within the file: **CVA styles/constants on top → types (`XxxRef`, `XxxProps`) → component.** Order within the function body, each under its comment: **props** destructure → **hooks** → **render vars** → **jsx** (composed with `cn()`).

2. **Named exports only**: the component plus its `Props` and `Ref` types; `displayName` set on `forwardRef` components. No default exports.

## Styling

1. **CVA for all visual variants.** Each component defines a local `styles` object of `cva()` calls; never ad-hoc conditional className logic at call sites.
2. **`cn()` for all className composition**: `twMerge(clsx(...))` from `utils/theme.ts`, which also re-exports `cva` and `VariantProps` so components have one import point.
3. **Layout utilities at the call site, visual styles in the CVA.** `w-full`, grid placement, margins come from the parent; color, radius, type, borders live in the component's variants.
4. **Semantic tokens only.** No raw hex, no palette utilities (`text-zinc-400`), no arbitrary color values in JSX. Backgrounds pair with their foregrounds (`bg-primary` → `text-primary-foreground`).
5. **Type comes from the ramps.** Use the heading/expressive/body typography utilities defined by the design tokens: no arbitrary `text-[13px]`. Uppercase is CSS `uppercase`; content is written in normal case.
6. **Tailwind v4 CSS-first.** All theme extension in the project's theme stylesheet (`app/globals.css`) under `@theme`; no `tailwind.config.ts`.
7. **`asChild` + Radix `Slot`** when a component delegates rendering (`<Button asChild><Link …/></Button>`); never nest interactive elements.

## Theming

1. **`next-themes` owns light, dark, and system detection.** Set `defaultTheme="system"` with `enableSystem`, and put `suppressHydrationWarning` on `<html>`: the provider resolves the theme on the client, which mismatches the server render without it.
2. **A theme-aware component renders a placeholder until mounted.** Gate it on a `useEffect` + `useState` mounted flag, or icons and states server-render against the wrong theme.
3. **The toggle cycles `system → light → dark`**, not light↔dark, so a reader returns to system preference without a page reload.
4. **Dark mode is a Tailwind v4 custom variant**: `@custom-variant dark (&:where(.dark, .dark *))`, with the dark token values in `.dark {}` beside the light ones.

## Organization: this repo does not use atomic design

This repo uses a flat two-folder split, not an atoms/molecules/organisms/templates
hierarchy:

- `components/ui/`: reusable primitives and shared building blocks (buttons, cards,
  sections, dialogs, marquees: anything usable from more than one route). shadcn CLI
  imports land here (the `components.json` `ui` alias points there) and are reformatted
  on arrival.
- `components/layout/`: the persistent shell, `Header` and `Footer`.
- **All component definitions live under `components/`, never inline in `app/`.** A route's
  `page.tsx` composes components; it doesn't define new ones. Page-specific components still
  go in `components/ui/` alongside shared ones; nothing lives under `app/` besides Next.js's
  own route files (`page.tsx`, `layout.tsx`, `opengraph-image.tsx`, etc.).

## Layout shell

1. **One persistent shell wraps every page**: `Header` and `Footer` from
   `components/layout/`, composed in the root layout around each route's page content.
2. Page sections are plain composed JSX in each route's `page.tsx` (or a page-local
   component), not a shared `section` template: this repo has no enforced three-width
   wrapper primitive.

## Reusability

1. **All components are reusable by construction.** Content is passed in via props or children, never defined inside a component. Content is defined in `constants/`, API calls, or pages (the consuming layer) only. A component with a hardcoded heading is a bug.
