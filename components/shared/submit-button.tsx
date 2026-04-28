"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  pending: boolean;
};

export function SubmitButton({ label, pendingLabel, pending }: SubmitButtonProps) {
  return (
    <Button className="w-full" disabled={pending} type="submit">
      {pending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          {pendingLabel ?? "Procesando..."}
        </>
      ) : (
        label
      )}
    </Button>
  );
}
