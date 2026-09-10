"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { changePassword } from "@/actions/change-password-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

const ChangePasswordForm = () => {
  const router = useRouter();
  const { update } = useSession();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  const result = await changePassword(
    currentPassword,
    newPassword,
    confirmPassword,
  );

  if (!result.success) {
    setError(result.message);
    setLoading(false);
    return;
  }

  await update({
    mustChangePassword: false,
  });

  router.replace("/dashboard");
  router.refresh();
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Change Your Password
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            You are using a temporary password. You must
            create a new password before continuing.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              Temporary Password
            </Label>

            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">
              New Password
            </Label>

            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm New Password
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Changing Password..."
              : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;