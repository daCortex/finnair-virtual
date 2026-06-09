import { redirect } from "next/navigation";

// This deployment is the Crew Center only — send the root straight there.
export default function Home() {
  redirect("/crew");
}
