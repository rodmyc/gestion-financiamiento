import { redirect } from "next/navigation";

import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { getDefaultRedirectPath, requireSession } from "@/lib/auth-helpers";

export default async function ChangePasswordPage() {
  const session = await requireSession();

  if (!session.user.mustChangePassword) {
    redirect(getDefaultRedirectPath(session.user));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(2,132,199,0.16),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eff6ff_100%)] px-6 py-16">
      <div className="w-full max-w-lg">
        <ChangePasswordForm />
      </div>
    </main>
  );
}
