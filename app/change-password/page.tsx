import { validatePasswordResetToken } from "@/actions/password-reset-actions";
import ChangePasswordForm from "@/components/auth/change-password-form";

type ChangePasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ChangePasswordPage({
  searchParams,
}: ChangePasswordPageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return (
      <InvalidResetLink
        message="This password reset link is missing a token."
      />
    );
  }

  const result = await validatePasswordResetToken(token);

  if (!result.success) {
    return (
      <InvalidResetLink
        message={
          result.message ??
          "This password reset link is invalid or has expired."
        }
      />
    );
  }

  return <ChangePasswordForm token={token} />;
}
function InvalidResetLink({
  message,
}: {
  message: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">
          Invalid Reset Link
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </main>
  );
}