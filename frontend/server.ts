/**
 * Copilot Runtime for this harness.
 *
 * Shape comes from the Angular quickstart's Node runtime server
 * (https://docs.copilotkit.ai/angular/deepagents/quickstart), with the agent
 * bound to the DeepAgents backend in `../backend` — the Angular/DeepAgents
 * quickstart defers the backend step to "register this backend as the
 * `default` agent".
 *
 * That backend is a LangGraph server: `createDeepAgent(...)` in backend/agent.ts
 * is exported as the `sample_agent` graph in backend/langgraph.json, and
 * `langgraph dev` serves it over the LangGraph API on port 2024. So the binding
 * here is `LangGraphAgent` from `@copilotkit/runtime/langgraph`, addressed by
 * deployment URL plus graph id rather than a single AG-UI endpoint.
 *
 * `default` and `support` resolve to the same DeepAgents graph. `support`
 * exists so the doc snippets that use `agentId="support"` (Chat UI, Threads)
 * run verbatim. Each id gets its own `LangGraphAgent` instance because the
 * adapter keeps per-agent run state.
 *
 * `a2ui: {}` enables A2UIMiddleware for every registered agent, per
 * https://docs.copilotkit.ai/angular/deepagents/guides/a2ui
 */
import { createServer } from "node:http";
import { CopilotRuntime } from "@copilotkit/runtime/v2";
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

// `langgraph dev` from backend/ serves the LangGraph API on port 2024.
const deploymentUrl =
  process.env["DEEPAGENTS_DEPLOYMENT_URL"] ?? "http://localhost:2024";

// The graph key in backend/langgraph.json.
const graphId = process.env["DEEPAGENTS_GRAPH_ID"] ?? "sample_agent";

const runtime = new CopilotRuntime({
  agents: {
    default: new LangGraphAgent({ deploymentUrl, graphId }),
    support: new LangGraphAgent({ deploymentUrl, graphId }),
  },
  a2ui: {},
});

const port = Number(process.env["PORT"] ?? 8200);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: "/api/copilotkit",
    cors: true,
  }),
).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
  console.log(`DeepAgents graph "${graphId}" at ${deploymentUrl}`);
});
