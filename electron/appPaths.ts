import { createRequire } from "node:module";
import path from "node:path";
import type { App } from "electron";

const nodeRequire = createRequire(import.meta.url);
const { app } = nodeRequire("electron") as { app: App };

if (process.env["VITE_DEV_SERVER_URL"]) {
	const devUserDataPath = path.join(app.getPath("appData"), "CrabRecords-dev");
	app.setPath("userData", devUserDataPath);
	app.setPath("sessionData", path.join(devUserDataPath, "session"));
}

export const USER_DATA_PATH = app.getPath("userData");
export const RECORDINGS_DIR = path.join(USER_DATA_PATH, "recordings");
