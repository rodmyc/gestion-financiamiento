import { LogOut } from "lucide-react";

import { signOutAction } from "@/app/actions/session";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button className="gap-2" type="submit" variant="outline">
        <LogOut className="size-4" />
        Cerrar sesión
      </Button>
    </form>
  );
}
