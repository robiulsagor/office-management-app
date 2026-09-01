"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { UserAccount } from "@/types/user";

type ResetPasswordDialogProps = {
  user: UserAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const ResetPasswordDialog = ({
  user,
  open,
  onOpenChange,
  onConfirm,
}: ResetPasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  if (!user) return null;

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!passwordsMatch) return;

    onConfirm();

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Reset Password
          </DialogTitle>

          <DialogDescription>
            Set a new password for{" "}
            <strong>{user.employeeName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="new-password">
              New Password
            </Label>

            <div className="relative">
              <Input
                id="new-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="pr-10"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev,
                  )
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              Confirm Password
            </Label>

            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value,
                )
              }
              placeholder="Confirm new password"
            />
          </div>

          {confirmPassword &&
            !passwordsMatch && (
              <p className="text-sm text-destructive">
                Passwords do not match.
              </p>
            )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!passwordsMatch}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Reset Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;