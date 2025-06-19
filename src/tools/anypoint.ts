import { ANYPOINT_AUTH_URL, ANYPOINT_PROFILE_URL } from "../constants.js";

class Anypoint {
    private token: string | undefined;
    private tokenExpiration: Date | undefined;
    organizationId: string | undefined;
    ownerId: string | undefined;

    constructor() {
    }

    public getHeaders() {
        return {
            "Authorization": `Bearer ${this.token}`,
            "x-organization-id": this.organizationId || "",
            "x-owner-id": this.ownerId || "",
            "Content-Type": "application/json"
        }
    }
    
    async authenticate() {
        const body = {
            client_id: process.env.ANYPOINT_CLIENT_ID,
            client_secret: process.env.ANYPOINT_CLIENT_SECRET,
            grant_type: "client_credentials"
        }
        const response = await fetch(`${ANYPOINT_AUTH_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const data = await response.json();
        this.token = data.access_token;
        this.tokenExpiration = new Date(Date.now() + data.expires_in * 1000);
        const profile = await this.retrieveProfile();
        this.organizationId = profile.user.organizationId;
        this.ownerId = profile.user.id;
    }

    private async retrieveProfile() {
        const response = await fetch(`${ANYPOINT_PROFILE_URL}`, {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        })
        const data = await response.json();
        return data;
    }

    private isTokenExpired() {
        return this.tokenExpiration && this.tokenExpiration < new Date();
    }

    async getToken() {
        if (this.token && !this.isTokenExpired()) {
            return this.token;
        }
        await this.authenticate();
        return this.token;
    }
}

export default Anypoint;
