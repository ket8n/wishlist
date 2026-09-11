import { BrandMark } from "@/components/brand-mark";
import { GitHubIcon, GoogleIcon } from "@/components/auth/provider-icons";
import { Button } from "@/components/ui/button";
import { signInWithGitHub, signInWithGoogle } from "@/lib/auth/actions";

// Auth.js error codes → generic, user-facing copy. Never surface provider detail.
function errorMessage(error: string | undefined) {
  if (!error) return null;
  if (error === "OAuthAccountNotLinked") {
    return "That email already uses a different sign-in option. Try the other one.";
  }
  return "We couldn't sign you in. Please try again.";
}

export function LoginCard({ error }: { error?: string }) {
  const message = errorMessage(error);

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <section
        aria-labelledby="login-title"
        className="w-full max-w-[400px] rounded-[14px] border border-dialog bg-card p-7 shadow-card"
      >
        <h1 id="login-title">
          <BrandMark />
        </h1>
        <p className="mt-3 text-[13px] leading-[1.45] text-ink-muted">
          A private place for the things you&apos;re still thinking about.
        </p>

        <div className="mt-7 flex flex-col gap-2.5">
          {message && (
            <p role="alert" className="text-[12.5px] leading-[1.45] text-rejected">
              {message}
            </p>
          )}
          <form action={signInWithGoogle}>
            <ProviderButton icon={<GoogleIcon className="size-[18px]" />}>
              Continue with Google
            </ProviderButton>
          </form>
          <form action={signInWithGitHub}>
            <ProviderButton icon={<GitHubIcon className="size-[18px] text-ink" />}>
              Continue with GitHub
            </ProviderButton>
          </form>
        </div>
      </section>
    </main>
  );
}

function ProviderButton({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button type="submit" className="relative h-11 w-full text-[13.5px] lg:h-11">
      <span className="absolute left-4 flex">{icon}</span>
      {children}
    </Button>
  );
}
