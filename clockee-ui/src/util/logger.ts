import consola from "consola";

const isServer = typeof window === "undefined";

const logger = consola.withTag(isServer ? "SERVER" : "CLIENT");

export { logger };
