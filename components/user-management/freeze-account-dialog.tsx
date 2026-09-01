"use client";

import {
  AlertTriangle,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { UserAccount } from "@/types/user";

type FreezeAccountDialogProps = {
  user: UserAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const FreezeAccountDialog = ({
  user,
  open,
  onOpenChange,
  onConfirm,
}: FreezeAccountDialogProps) => {
  if (!user) return null;

  const isFrozen =
    user.accountStatus === "frozen";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isFrozen
              ? "Unfreeze Account"
              : "Freeze Account"}
          </DialogTitle>

          <DialogDescription>
            {isFrozen
              ? `Allow ${user.employeeName} to access the platform again.`
              : `Prevent ${user.employeeName} from logging into the platform.`}
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="size-4" />

          <AlertTitle>
            {isFrozen
              ? "Restore account access"
              : "Account access will be blocked"}
          </AlertTitle>

          <AlertDescription>
            {isFrozen
              ? "The employee will be able to log in again."
              : "The employee will no longer be able to log in until the account is unfrozen."}
          </AlertDescription>
        </Alert>

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
            type="button"
            variant={
              isFrozen
                ? "default"
                : "destructive"
            }
            onClick={onConfirm}
          >
            {isFrozen
              ? "Unfreeze Account"
              : "Freeze Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreezeAccountDialog;