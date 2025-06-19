import { ANYPOINT_DESIGN_CENTER_URL } from "../constants.js";
import Anypoint from "./anypoint.js";

export interface Content {
    path: string;
    content: string;
}

export interface ProjectDetail {
    name: string;
    apiVersion: string;
    version: string;
    tags: string[];
    main: string;
    assetId: string;
    groupId: string;
    classifier?: "raml" | "oas";
    isVisual: boolean;
    status: "development" | "published";
    metadata?: {
        projectId: string;
        branchId: string;
    };
}

class DesignCenter extends Anypoint {
    constructor() {
        super();
    }

    async acquireLock(projectId: string, branch: string = "master") {
        try {
            const response = await fetch(`${ANYPOINT_DESIGN_CENTER_URL}/projects/${projectId}/branches/${branch}/acquireLock`, {
                method: "POST",
                headers: this.getHeaders()
            });
            return response.json();
        } catch (error) {
            console.error("Error acquiring lock", error);
            throw error;
        }
    }

    async releaseLock(projectId: string, branch: string = "master") {
        try {
            const response = await fetch(`${ANYPOINT_DESIGN_CENTER_URL}/projects/${projectId}/branches/${branch}/releaseLock`, {
                method: "POST",
                headers: this.getHeaders()
            });
            return response.json();
        } catch (error) {
            console.error("Error releasing lock", error);
            throw error;
        }
    }

    async getProjects() {
        try {
            const response = await fetch(`${ANYPOINT_DESIGN_CENTER_URL}/projects`, {
                headers: this.getHeaders()
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error getting projects", error);
            throw error;
        }
    }

    async getProjectById(projectId: string, branch: string = "master") {
        try {
            const response = await fetch(`${ANYPOINT_DESIGN_CENTER_URL}/projects/${projectId}/branches/${branch}/files`, {
                headers: this.getHeaders()
            });
            const projectFiles = await response.json();
            const ignoreFiles = [".gitignore", "exchange.json", "exchange_modules"]
            
            const files = projectFiles.filter((file: any) => file.type.toLowerCase() === "file" && !ignoreFiles.includes(file.path) );
            // Write a parallel api calls to get file content for each file in the response
            const fileContents = await Promise.all(files.map(async (file: any) => {
                const fileContent = await fetch(`${ANYPOINT_DESIGN_CENTER_URL}/projects/${projectId}/branches/${branch}/files/v2/${file.path}`, {
                    headers: this.getHeaders()
                });
                return fileContent.text();
            }));

            const data = files.map((file: any, index: number) => ({
                ...file,
                content: fileContents[index]
            }));
            return data;
        } catch (error) {
            console.error("Error getting project by id", error);
            throw error;
        }
    }

    async createProject(projectName: string, projectDescription: string="", projectType: string="raml", classifier: string="raml") {
        try {
            const response = await fetch(`${ANYPOINT_DESIGN_CENTER_URL}/projects`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    name: projectName,
                    description: projectDescription.length > 0 ? projectDescription : projectName,
                    classifier: classifier
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error creating project", error);
            throw error;
        }
    }

    async createProjectWithContent(projectId: string, files: Content[], branch: string="master") {
        try {
            await this.releaseLock(projectId, branch);
            await this.acquireLock(projectId, branch);

            const response = await fetch(`${ANYPOINT_DESIGN_CENTER_URL}/projects/${projectId}/branches/${branch}/save`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(files)
            });

            await this.releaseLock(projectId, branch);

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error adding content to project", error);
            throw error;
        }
    }

    async publishProjectToExchange(projectId: string, projectDetail: ProjectDetail, branch: string="master") {
        try {
            await this.releaseLock(projectId, branch);
            await this.acquireLock(projectId, branch);

            const response = await fetch(`${ANYPOINT_DESIGN_CENTER_URL}/projects/${projectId}/branches/${branch}/publish/exchange`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    name: projectDetail.name,
                    apiVersion: projectDetail.apiVersion ?? "v1",
                    version: projectDetail.version ?? "1.0.0",
                    tags: projectDetail.tags ?? ["api", "raml"],
                    main: projectDetail.main,
                    assetId: projectDetail.assetId,
                    groupId: this.organizationId,
                    classifier: projectDetail.classifier || "raml",
                    isVisual: projectDetail.isVisual || true,
                    status: projectDetail.status || "development",
                    metadata: {
                        projectId: projectId,
                        branchId: branch
                    }
                })
            });

            await this.releaseLock(projectId, branch);
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error publishing project to exchange", error);
            throw error;
        }
    }
}

export default DesignCenter;