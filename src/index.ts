import dotenv from "dotenv";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import MuleSoftServer from "./server.js";

dotenv.config({
    path: ".env"
});

async function main() {
    const clientId = process.env.ANYPOINT_CLIENT_ID;
    const clientSecret = process.env.ANYPOINT_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        console.error("ANYPOINT_CLIENT_ID and ANYPOINT_CLIENT_SECRET must be set");
        process.exit(1);
    }

    let transport: StdioServerTransport | null = null;
    const server = new MuleSoftServer();
    transport = new StdioServerTransport();
    await server.start(transport);
}

try {
    main();
} catch (error) {
    console.error("Error starting server", error);
    process.exit(1);
}