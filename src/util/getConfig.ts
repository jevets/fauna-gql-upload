import path from "path";
import fs from "fs";
import { Plugin } from "../types";
import { argv } from "yargs";

interface IOptions {
  apiEndpointEnv: string;
  graphqlEndpointEnv: string;
  schemaPath: string;
  tsconfigPath?: string;
  envPath: string;
  secretEnv: string;
  fnsDir: string;
  rolesDir: string;
  indexesDir: string;
  dataDir: string;
  providersDir: string;
  codegen?: {
    typescript: boolean;
    operations: boolean;
    outputFile: string;
    headers: { [key: string]: string };
    documents: string[];
    plugins: Plugin[];
    pluginOptions: { [key: string]: string };
  } | null;
}

const cwd = process.cwd();
const defaultSchema = fs.existsSync("./fauna/schema.gql")
  ? "./fauna/schema.gql"
  : "./fauna/schema.graphql";
const defaultRolesDir = path.join("fauna", "roles");
const defaultFnsDir = path.join("fauna", "functions");
const defaultIndexesDir = path.join("fauna", "indexes");
const defaultDataDir = path.join("fauna", "data");
const defaultProvidersDir = path.join("fauna", "providers");
const defaultSecretEnv = "FGU_SECRET";
const defaultApiEndpointEnv = "FGU_API_ENDPOINT";
const defaultGraphqlEndpointEnv = "FGU_GRAPHQL_ENDPOINT";

let globalConfig: IOptions | null = null;

export default function getConfig() {
  if (globalConfig) return globalConfig;

  const configPath = (argv.project as string) ?? path.join(cwd, ".fauna.json");
  const providedConfig = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf8"))
    : {};
  const codegenTypescript = providedConfig.codegen?.typescript ?? true;

  const config: IOptions = {
    apiEndpointEnv: providedConfig.apiEndpointEnv || defaultApiEndpointEnv,
    graphqlEndpointEnv:
      providedConfig.graphqlEndpointEnv || defaultGraphqlEndpointEnv,
    schemaPath: providedConfig.schemaPath || defaultSchema,
    tsconfigPath: providedConfig.tsconfigPath,
    envPath: providedConfig.envPath || ".env",
    secretEnv: providedConfig.secretEnv || defaultSecretEnv,
    fnsDir: providedConfig.fnsDir || defaultFnsDir,
    rolesDir: providedConfig.rolesDir || defaultRolesDir,
    indexesDir: providedConfig.indexesDir || defaultIndexesDir,
    dataDir: providedConfig.dataDir || defaultDataDir,
    providersDir: providedConfig.providersDir || defaultProvidersDir,
    codegen: providedConfig.codegen
      ? {
          typescript: codegenTypescript,
          operations: providedConfig.codegen.operations ?? true,
          outputFile:
            providedConfig.codegen.outputFile ||
            (codegenTypescript
              ? "generated/graphql.ts"
              : "generated/graphql.js"),
          headers: providedConfig.codegen.headers || {},
          documents: providedConfig.codegen.documents || [],
          plugins: providedConfig.codegen.plugins || [],
          pluginOptions: providedConfig.codegen.pluginOptions || {},
        }
      : null,
  };

  globalConfig = config;
  return config;
}
