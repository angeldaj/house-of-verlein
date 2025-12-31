import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button variant="outline" className="rounded-full" type="submit">
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
      </Button>
    </form>
  );
}
