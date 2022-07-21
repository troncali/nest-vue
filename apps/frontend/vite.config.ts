/// <reference types="vitest" />
import { defineConfig, type UserConfigExport } from "vite";
import type { UserConfigExport as VitestConfig } from "vitest/config";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx()],
	publicDir: "./src/static",
	cacheDir: "../../.yarn/cache/vite",
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	},
	build: {
		outDir: "../../dist/apps/frontend"
	},
	preview: {
		open: false
	},
	server: {
		port: 8080,
		strictPort: true,
		open: true
	},
	test: {
		environment: "jsdom",
		watch: false,
		cache: { dir: "../../.yarn/cache/vitest/frontend" },
		reporters: ["default", "json", "junit"],
		outputFile: {
			json: "../../dist/tests/vitest-frontend-unit.json",
			junit: "../../dist/tests/junit-vitest-frontend-unit.xml"
		}
	},
	css: {
		postcss: "./apps/frontend"
	}
} as UserConfigExport & VitestConfig);
