import { signOut } from "../utils/auth";
import { requireUser } from "../utils/hooks";

export default async function DashboardRoute() {

  const session = await requireUser();

  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
    </form>
  )
}