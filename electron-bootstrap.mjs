import Module from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as electronMain from "electron/main";

const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
	if (request === "electron") {
		return electronMain;
	}

	return originalLoad.call(this, request, parent, isMain);
};

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const bundledMainPath = path.join(rootDir, "dist-electron", "main.cjs");

await import(pathToFileURL(bundledMainPath).href);
