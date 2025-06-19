import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequest,
    CallToolRequestSchema,
    ListToolsRequest,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DESIGN_CENTER_TOOLS, TOOLS } from "./constants.js";
import DesignCenter, { Content, ProjectDetail } from "./tools/designCenter.js";
import APIManager from "./tools/apiManager.js";

class MuleSoftServer {
    private server: Server;
    constructor() {
        this.server = new Server({
            name: "MuleSoft Server",
            version: "1.0.0"
        }, {
            capabilities: {
                tools: {
                    listChanged: true
                },
                prompts: {
                    listChanged: true
                },
                logging: {
                    level: "debug"
                }
            }
        });

        this.server.setRequestHandler(
            CallToolRequestSchema,
            this.muleSoftServerHandler
        )

        this.server.setRequestHandler(
            ListToolsRequestSchema,
            this.listToolsHandler
        );

    }

    async start(transport: StdioServerTransport) {
        try {
            await this.server.connect(transport);
        } catch (error) {
            console.error("Error connecting to server", error);
            process.exit(1);
        }
    }

    toResponse(content: any) {
        return {
            content: [{
                type: "text",
                text: JSON.stringify(content)
            }]
        }
    }

    muleSoftServerHandler = async (request: CallToolRequest) => {
        let response: any;
        const designCenter = new DesignCenter();
        const apiManager = new APIManager();
        await designCenter.getToken();
        await apiManager.getToken();
        try {
            switch (request.params.name) {
                case TOOLS.DESIGN_CENTER:
                    const projects = await designCenter.getProjects();
                    response = this.toResponse(projects);
                    break;
                case TOOLS.GET_DESIGN_CENTER_PROJECT:
                    const project = await designCenter.getProjectById(request.params.arguments?.projectId as string);
                    response = this.toResponse(project);
                    break;
                case TOOLS.CREATE_DESIGN_CENTER_PROJECT:
                    const newProject = await designCenter.createProject(request.params.arguments?.projectName as string, request.params.arguments?.projectDescription as string);
                    response = this.toResponse(newProject);
                    break;
                case TOOLS.CREATE_DESIGN_CENTER_PROJECT_WITH_CONTENT:
                    const addedContent = await designCenter.createProjectWithContent(
                        request.params.arguments?.projectId as string,
                        request.params.arguments?.files as Content[]
                    );
                    response = this.toResponse(addedContent);
                    break;
                case TOOLS.PUBLISH_DESIGN_CENTER_PROJECT_TO_EXCHANGE:
                    const publishedProject = await designCenter.publishProjectToExchange(
                        request.params.arguments?.projectId as string,
                        request.params.arguments?.projectDetails as ProjectDetail
                    );
                    response = this.toResponse(publishedProject);
                    break;
                case TOOLS.GET_API_MANAGER_ENVIRONMENTS:
                    const environments = await apiManager.getEnvironments();
                    response = this.toResponse(environments);
                    break;
                case TOOLS.GET_API_MANAGER_APIS_FROM_ENVIRONMENT:
                    const apis = await apiManager.getAPIsFromEnvironment(request.params.arguments?.environmentId as string);
                    response = this.toResponse(apis);
                    break;
                default:
                    response = this.toResponse({ message: "Hello, world!" });
                    break;
            }
        } catch (error) {
            console.error("Error processing request", error);
            response = this.toResponse({ error: error });
        }
        return response;
    }

    listToolsHandler = () => {
        return {
            tools: DESIGN_CENTER_TOOLS
        }
    }
}

export default MuleSoftServer;