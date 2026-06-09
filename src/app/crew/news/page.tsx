import { listNews } from "@/lib/db";
import { NewsAdmin } from "@/components/NewsAdmin";

export const dynamic = "force-dynamic";

export default async function CrewNews() {
  const posts = await listNews();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <NewsAdmin posts={posts} />
    </section>
  );
}
