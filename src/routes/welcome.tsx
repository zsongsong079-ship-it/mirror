import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Mirror — 解释权，属于你" },
      {
        name: "description",
        content: "Mirror 不告诉你这张牌意味着什么。它问你：你看见了什么。",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/start", replace: true });
  }, [navigate]);

  return <div className="min-h-screen bg-paper" />;
}
