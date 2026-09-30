import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLogin } from "@/components/auth/admin-login";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLogin />
    </Suspense>
  );
}
