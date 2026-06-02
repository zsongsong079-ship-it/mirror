import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-6xl font-light text-ink">Not here</h1>
        <p className="mt-4 font-serif italic text-ink-3">
          This page hasn't been written yet, or it has wandered off.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3 text-sm font-medium text-paper tracking-ui transition-colors hover:bg-ink-2"
          >
            Return to the start
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-light text-ink">Something quiet went wrong.</h1>
        <p className="mt-3 font-sans text-sm text-ink-3 leading-relaxed">
          The page didn't load. Your reflection is safe — only this step needs another try.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3 text-sm font-medium text-paper tracking-ui transition-colors hover:bg-ink-2"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-paper-3 bg-paper px-6 py-3 text-sm font-medium text-ink tracking-ui transition-colors hover:bg-paper-2"
          >
            Return to the start
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mirror — See how you see." },
      {
        name: "description",
        content:
          "Mirror is a quiet space for self-reflection using tarot as a projective mirror. Not predictions — a way to hear what you're already thinking.",
      },
      { property: "og:title", content: "Mirror — See how you see." },
      {
        property: "og:description",
        content: "A slow, introspective journaling tool. Tarot as a mirror, not an oracle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Mirror — See how you see." },
      { name: "description", content: "A quiet space for self-observation. Tarot cards become mirrors for noticing attention, emotions, stories, and meaning." },
      { property: "og:description", content: "A quiet space for self-observation. Tarot cards become mirrors for noticing attention, emotions, stories, and meaning." },
      { name: "twitter:description", content: "A quiet space for self-observation. Tarot cards become mirrors for noticing attention, emotions, stories, and meaning." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b820a66b-9b62-491f-927c-b5b77e36d7d9/id-preview-8d1a10a2--cd87cf48-0f02-4e9c-9bbc-8e7f7fc18800.lovable.app-1780109302396.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b820a66b-9b62-491f-927c-b5b77e36d7d9/id-preview-8d1a10a2--cd87cf48-0f02-4e9c-9bbc-8e7f7fc18800.lovable.app-1780109302396.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
