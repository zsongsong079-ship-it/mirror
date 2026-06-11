import { createFileRoute } from "@tanstack/react-router";

import { Route as StartRoute } from "./start";

export const Route = createFileRoute("/app")({
  component: StartRoute.options.component as never,
});
