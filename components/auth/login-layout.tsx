"use client";

import { ReactNode } from "react";

type LoginLayoutProps = {
  error: string | null;
  title: ReactNode;
  topIcon: ReactNode;
  children: ReactNode;
};

export function LoginLayout(props: LoginLayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <span className="font-display text-2xl font-bold text-foreground">
          TechTank<span className="text-ring"> Admin</span>
        </span>
      </div>

      <div className="glass rounded-2xl p-8 text-center">
        <span className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          {props.topIcon}
        </span>

        <h1 className="font-display text-xl font-semibold text-foreground">{props.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The back office is for TechTank organizers. Sign in with the Slack account you use in our workspace.
        </p>

        {props.error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {props.error}
          </p>
        )}

        {props.children}

        <p className="mt-4 text-xs text-muted-foreground">
          Not an organizer?{" "}
          <a href="/tasks" className="text-ring underline">
            Browse tasks
          </a>{" "}
          instead.
        </p>
      </div>
    </div>
  );
}
