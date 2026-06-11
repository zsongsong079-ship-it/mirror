import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mirror — A Self-Narrative OS" },
      {
        name: "description",
        content:
          "Mirror is a Self-Narrative OS for observing how you interpret reality.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <h1>Mirror</h1>
      <p>
        We don't live in the world itself. We live in our interpretation of it.
      </p>
      <Link to="/app">Enter Mirror</Link>
    </div>
  );
}
