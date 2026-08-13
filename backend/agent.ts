import { createDeepAgent } from "deepagents";
import { copilotkitMiddleware } from "@copilotkit/sdk-js/langgraph";
import { tool } from "langchain";
import { z } from "zod";

const getWeather = tool(
    async ({ location }) => `The weather in ${location} is sunny.`,
    {
        name: "get_weather",
        description: "Get the weather for a given location.",
        schema: z.object({ location: z.string().describe("The location to get the weather for") }),
    }
);

export const agent = createDeepAgent({
    model: "openai:gpt-4o",
    tools: [getWeather],
    middleware: [copilotkitMiddleware],
    systemPrompt: "You are a helpful research assistant.",
});