#!/usr/bin/env node
import yargs from "yargs";
import { upload } from "./index";

const argv = yargs
  .option("override", {
    alias: "o",
    description:
      "Override the schema, this will delete all your data in the database.",
    type: "boolean",
  })
  .option("yes", {
    alias: "y",
    description: "Answer yes to all potential prompts.",
    type: "boolean",
  })
  .option("project", {
    alias: "p",
    description: "Path to project configuration file (default .fauna.json)",
    type: "string",
  }).argv;

upload({ override: argv.override });
