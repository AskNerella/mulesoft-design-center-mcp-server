import { ANYPOINT_API_MANAGER_URL, ANYPOINT_ENVIRONMENTS_URL } from "../constants.js";
import Anypoint from "./anypoint.js";

class APIManager extends Anypoint {
    constructor() {
        super();
    }

    async getEnvironments() {
        try {
            console.log("URL", `${ANYPOINT_ENVIRONMENTS_URL}/organizations/${this.organizationId}/environments`);
            console.log("Bearer Token", this.getHeaders());
            const response = await fetch(`${ANYPOINT_ENVIRONMENTS_URL}/organizations/${this.organizationId}/environments`, {
                headers: this.getHeaders()
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error getting environments", error);
            throw error;
        }
    }

    async getAPIsFromEnvironment(environmentId: string) {
        try {
            const response = await fetch(`${ANYPOINT_API_MANAGER_URL}/organizations/${this.organizationId}/environments/${environmentId}/apis`, {
                headers: this.getHeaders()
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error getting API from environment", error);
            throw error;
        }
    }
}

export default APIManager;
