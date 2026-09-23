"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  items: { name: string; href: string }[];
};

export function Subnav(props: Props) {
  const pathname = usePathname();

  return (
    <div className="px-6 lg:px-8">
      <div className="flex items-center justify-start py-3">
        <div className="flex flex-wrap items-center justify-center gap-1">
          {props.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button key={item.href} variant="nav" size="sm" isActive={isActive} asChild>
                <Link href={item.href}>{item.name}</Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
