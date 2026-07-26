import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">@uturi/sonification</h1>
      <p className="max-w-xl text-lg text-fd-muted-foreground">
        Turn numbers into sound to make data more accessible—an auditory alternative to charts for
        non-visual users.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs"
          className="rounded-md bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition hover:opacity-90"
        >
          Read the docs
        </Link>
        <a
          href="https://github.com/ksr20612/uturi/tree/main/packages/sonification"
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-fd-border px-5 py-2.5 text-sm font-medium text-fd-foreground transition hover:bg-fd-accent"
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
