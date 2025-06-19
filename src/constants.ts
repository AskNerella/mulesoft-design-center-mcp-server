import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TOOLS = {
  DESIGN_CENTER: "get_design_center_assets",
  GET_DESIGN_CENTER_PROJECT: "get_design_center_project",
  CREATE_DESIGN_CENTER_PROJECT: "create_design_center_project",
  CREATE_DESIGN_CENTER_PROJECT_WITH_CONTENT: "create_api_spec_with_content",
  PUBLISH_DESIGN_CENTER_PROJECT_TO_EXCHANGE: "publish_project_to_exchange",

  // API Manager
  GET_API_MANAGER_ENVIRONMENTS: "get_api_manager_environments",
  GET_API_MANAGER_APIS_FROM_ENVIRONMENT: "get_api_manager_apis_from_environment",
};

export const DESIGN_CENTER_TOOLS: Tool[] = [
  {
    name: TOOLS.DESIGN_CENTER,
    description: "Retrieve all assets or API Specifications defined in Anypoint Design Center of MuleSoft Anypoint Platform.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
  },
  {
    name: TOOLS.GET_DESIGN_CENTER_PROJECT,
    description:
      "Get a project data, files and file content from Design Center",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["projectId"],
      properties: {
        projectId: {
          type: "string",
          description: "The ID of the project to get",
        },
        branch: {
          type: "string",
          description: "The branch of the project to get",
          default: "master",
        },
      },
    },
  },
  {
    name: TOOLS.CREATE_DESIGN_CENTER_PROJECT,
    description: "Create a new project in Design Center or MuleSoft Anypoint Platform",
    inputSchema: {
      "title": "Design Center Project",
      "type": "object",
      "required": ["name", "classifier"],
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the project",
          "maxLength": 100,
        },
        "description": {
          "type": "string",
          "description": "Optional description of the project",
        },
        "classifier": {
          "type": "string",
          "enum": ["raml", "raml-fragment", "oas"],
          "description": "The specification classifier type",
        },
      },
      "additionalProperties": false,
    },
  },
  {
    name: TOOLS.CREATE_DESIGN_CENTER_PROJECT_WITH_CONTENT,
    description:
      "Add RAML or YAML content to a Design Center based on the Project ID of the API Specification",
    inputSchema: {
      "type": "object",
      "required": ["projectId", "files"],
      "properties": {
        "projectId": {
          "type": "string",
          "format": "uuid",
          "description": "UUID identifier for the associated project",
        },
        "files": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["path", "content"],
            "properties": {
              "path": {
                "type": "string",
                "pattern": "\\.(raml|ya?ml|json)$",
                "description":
                  "Typically use the project-name.raml, .yaml, .yml, or .json",
              },
              "content": {
                "type": "string",
                "description": "RAML or OpenAPI specification content",
              },
            },
            "additionalProperties": false,
          },
        },
      },
      "additionalProperties": false,
    },
  },
  {
    name: TOOLS.PUBLISH_DESIGN_CENTER_PROJECT_TO_EXCHANGE,
    description: "Publish a API Specification project to Exchange",
    inputSchema: {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "type": "object",
      "required": ["projectId", "projectDetails"],
      "additionalProperties": false,
      "properties": {
        "projectId": {
          "type": "string",
          "description": "Unique ID for the project"
        },
        "branch": {
          "type": "string",
          "description": "Branch of the project",
          "default": "master"
        },
        "projectDetails": {
          "type": "object",
          "required": [
            "name",
            "apiVersion",
            "version",
            "tags",
            "main",
            "assetId",
            "classifier",
            "status"
          ],
          "additionalProperties": false,
          "properties": {
            "name": {
              "type": "string",
              "description": "Project name"
            },
            "apiVersion": {
              "type": "string",
              "description": "Version of the API, which corresponds to the specification's version property",
              "example": "v1"
            },
            "version": {
              "type": "string",
              "description": "Version of the Exchange Asset to be published (must follow Semver syntax)",
              "pattern": "^\\d+\\.\\d+\\.\\d+$",
              "example": "1.0.0"
            },
            "tags": {
              "type": "array",
              "description": "An array of strings to be saved as asset's tags",
              "items": {
                "type": "string"
              },
              "example": ["raml", "specification"]
            },
            "main": {
              "type": "string",
              "description": "Main file of the project to be published",
              "example": "api.raml"
            },
            "assetId": {
              "type": "string",
              "description": "Exchange Asset ID",
              "example": "new-raml-specification"
            },
            "classifier": {
              "type": "string",
              "description": "Classifier of the project being published which is related to the asset's language",
              "enum": ["oas", "raml", "raml-fragment"],
              "example": "raml"
            },
            "isVisual": {
              "type": "boolean",
              "description": "True when the project is visual mode",
              "example": false,
              "default": true
            },
            "publishList": {
              "type": "array",
              "description": "Project files that are not being referenced from the root file to include in the asset",
              "items": {
                "type": "string"
              },
              "example": ["api.raml", "exchange.json"]
            },
            "originalFormatVersion": {
              "type": "string",
              "description": "The version of the format of the API specification",
              "example": "1.0"
            },
            "status": {
              "type": "string",
              "description": "Exchange asset lifecycle state",
              "enum": ["development", "published"]
            }
          }
        }
      }
    }    
  },
  {
    name: TOOLS.GET_API_MANAGER_ENVIRONMENTS,
    description: "Get all environments from API Manager",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
  },
  {
    name: TOOLS.GET_API_MANAGER_APIS_FROM_ENVIRONMENT,
    description: "Get all APIs from an environment from API Manager",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        environmentId: {
          type: "string",
          description: "The ID of the environment to get APIs from",
        },
      },
    },
  }
];

export const ANYPOINT_URL = "https://anypoint.mulesoft.com";
export const ANYPOINT_PROFILE_URL = `${ANYPOINT_URL}/accounts/api/me`;
export const ANYPOINT_AUTH_URL = `${ANYPOINT_URL}/accounts/api/v2/oauth2/token`;
export const ANYPOINT_DESIGN_CENTER_URL = `${ANYPOINT_URL}/designcenter/api-designer`;
export const ANYPOINT_ENVIRONMENTS_URL = `${ANYPOINT_URL}/accounts/api`;
export const ANYPOINT_API_MANAGER_URL = `${ANYPOINT_URL}/apimanager/api/v1`;
