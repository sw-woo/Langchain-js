import { IterableReadableStream } from "./stream.js";
export async function* createOllamaStream(baseUrl, params, options) {
    let formattedBaseUrl = baseUrl;
    if (formattedBaseUrl.startsWith("http://localhost:")) {
        // Node 18 has issues with resolving "localhost"
        // See https://github.com/node-fetch/node-fetch/issues/1624
        formattedBaseUrl = formattedBaseUrl.replace("http://localhost:", "http://127.0.0.1:");
    }
    const response = await fetch(`${formattedBaseUrl}/api/generate`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
            "Content-Type": "application/json",
        },
        signal: options.signal,
    });
    if (!response.ok) {
        const json = await response.json();
        const error = new Error(`Ollama call failed with status code ${response.status}: ${json.error}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error.response = response;
        throw error;
    }
    if (!response.body) {
        throw new Error("Could not begin Ollama stream. Please check the given URL and try again.");
    }
    const stream = IterableReadableStream.fromReadableStream(response.body);
    const decoder = new TextDecoder();
    let extra = "";
    for await (const chunk of stream) {
        const decoded = extra + decoder.decode(chunk);
        const lines = decoded.split("\n");
        extra = lines.pop() || "";
        for (const line of lines) {
            try {
                yield JSON.parse(line);
            }
            catch (e) {
                console.warn(`Received a non-JSON parseable chunk: ${line}`);
            }
        }
    }
}
