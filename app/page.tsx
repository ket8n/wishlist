import { BrandMark } from "@/components/brand-mark";
import { ThemeControl } from "@/components/theme/theme-control";

// Foundation shell for `/` (DESIGN_SPEC §9.1). Sign-in buttons arrive in phase 03.
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <section
        aria-labelledby="home-title"
        className="w-full max-w-[400px] rounded-[14px] border border-dialog bg-card p-7 shadow-card"
      >
        <h1 id="home-title">
          <BrandMark />
        </h1>
        <p className="mt-3 text-[13px] leading-[1.45] text-ink-muted">
          A private place for the things you&apos;re still thinking about.
        </p>

        <div className="mt-7 border-t border-subtle pt-5">
          <p className="eyebrow mb-3 text-ink-muted">
            Theme
          </p>
          <ThemeControl />
        </div>
      </section>
    </main>
  );
}
