"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  Link as LinkIcon,
} from "lucide-react";

import {
  generatePasswordResetLink,
  getPasswordResetStatus,
} from "@/actions/password-reset-actions";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { User } from "@/types/user";

type ResetPasswordDialogProps = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

const ResetPasswordDialog = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}: ResetPasswordDialogProps) => {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [requestedAt, setRequestedAt] = useState<string | null>(null);

  const [hasActiveToken, setHasActiveToken] = useState(false);
  const [activeTokenExpiresAt, setActiveTokenExpiresAt] = useState<
    string | null
  >(null);

  const [requiresConfirmation, setRequiresConfirmation] = useState(false);

  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !user) {
      return;
    }

    const loadStatus = async () => {
      setCheckingStatus(true);
      setError("");
      setResetUrl(null);
      setTokenExpiresAt(null);
      setCopied(false);
      setRequiresConfirmation(false);

      try {
        const result = await getPasswordResetStatus(user.id);

        if (!result.success) {
          setError(result.message ?? "Failed to check reset status.");
          return;
        }

        setHasPendingRequest(result.hasPendingRequest);
        setRequestedAt(result.requestedAt ?? null);

        setHasActiveToken(result.hasActiveToken);
        setActiveTokenExpiresAt(result.tokenExpiresAt ?? null);
      } catch (error) {
        console.error("Load password reset status error:", error);

        setError("Failed to check password reset status.");
      } finally {
        setCheckingStatus(false);
      }
    };

    loadStatus();
  }, [open, user]);

  const handleGenerateLink = async (directReset = false) => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const result = await generatePasswordResetLink(user.id, directReset);

      if (!result.success) {
        if (result.requiresConfirmation) {
          setRequiresConfirmation(true);
        }

        setError(result.message ?? "Failed to generate reset link.");
        return;
      }

      if (!result.resetToken || !result.expiresAt) {
        setError("Reset link was generated, but required data is missing.");
        return;
      }

      const url = `${window.location.origin}/change-password?token=${result.resetToken}`;

      setResetUrl(url);
      setTokenExpiresAt(result.expiresAt);

      setHasActiveToken(true);
      setActiveTokenExpiresAt(result.expiresAt);

      setRequiresConfirmation(false);

    } catch (error) {
      console.error("Generate password reset link error:", error);

      setError("Failed to generate password reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!resetUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(resetUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy reset URL error:", error);

      setError("Failed to copy the reset link.");
    }
  };

  const handleClose = () => {
    setResetUrl(null);
    setTokenExpiresAt(null);
    setCopied(false);
    setError("");
    setRequiresConfirmation(false);
  onSuccess?.();
  
    onOpenChange(false);
  };

  const formatDateTime = (date: string | null) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        } else {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Reset Password
          </DialogTitle>

          <DialogDescription>
            Generate a secure one-time password reset link for{" "}
            <span className="font-medium text-foreground">
              {user?.employee.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {checkingStatus ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Checking password reset status...
          </div>
        ) : resetUrl ? (
          <div className="space-y-5">
            <Alert>
              <Check className="h-4 w-4" />

              <AlertTitle>Reset link generated</AlertTitle>

              <AlertDescription>
                The password itself is not shown or generated for you. Send this
                secure link to the user so they can choose their own new
                password.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <LinkIcon className="h-4 w-4" />
                Password Reset Link
              </div>

              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1 rounded-md border bg-muted p-3">
                  <p className="break-all text-sm">{resetUrl}</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  title="Copy reset link"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {copied && (
                <p className="text-xs text-green-600">Reset link copied.</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Expires:</span>{" "}
                {formatDateTime(tokenExpiresAt)}
              </p>

              <p>
                This link can only be used once. After the user changes the
                password, the link becomes invalid.
              </p>

              <p>
                If you generate another reset link later, this link will be
                invalidated.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : requiresConfirmation ? (
          <div className="space-y-5">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />

              <AlertTitle>Password reset was not requested</AlertTitle>

              <AlertDescription>
                This user has not requested a password reset. Are you sure you
                want to generate a reset link directly as Super Admin?
              </AlertDescription>
            </Alert>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRequiresConfirmation(false);
                  setError("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={() => handleGenerateLink(true)}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Reset Link"}
              </Button>
            </DialogFooter>
          </div>
        ) : hasActiveToken ? (
          <div className="space-y-5">
            <Alert>
              <AlertTriangle className="h-4 w-4" />

              <AlertTitle>An active reset link already exists</AlertTitle>

              <AlertDescription>
                A password reset link has already been generated for this user
                and has not been used yet.
              </AlertDescription>
            </Alert>

            <div className="rounded-md border p-4 text-sm">
              <p className="text-muted-foreground">Current link expires:</p>

              <p className="mt-1 font-medium">
                {formatDateTime(activeTokenExpiresAt)}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              You cannot recover the previous link from the database. Generate a
              new link if you need to send it again. The previous link will
              immediately become invalid.
            </p>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={() => handleGenerateLink(true)}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate New Link"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-5">
            {hasPendingRequest && (
              <Alert>
                <KeyRound className="h-4 w-4" />

                <AlertTitle>Password reset requested</AlertTitle>

                <AlertDescription>
                  This user requested a password reset
                  {requestedAt ? ` on ${formatDateTime(requestedAt)}.` : "."}
                </AlertDescription>
              </Alert>
            )}

            {!hasPendingRequest && (
              <div className="rounded-md border p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      No reset request found
                    </p>

                    <p className="text-sm text-muted-foreground">
                      The user has not requested a password reset. If you still
                      want to reset this users password, you can generate a
                      reset link directly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={() => handleGenerateLink(false)}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Reset Link"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
