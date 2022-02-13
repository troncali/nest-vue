import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";

import { navbar } from "./configs";
import { sidebar } from "./configs";

export default defineUserConfig<DefaultThemeOptions>({
	base: "/",
	dest: "./dist/docs/vuepress",

	// site config
	lang: "en-US",
	title: "nest-vue",
	description: "Full-stack monorepo template.",

	// theme and its config
	theme: "@vuepress/theme-default",
	themeConfig: {
		logo: "/images/logo.png",
		repo: "troncali/nest-vue",
		docsDir: "docs",
		locales: {
			"/": {
				navbar: navbar.en,
				sidebar: sidebar.en
			}
		}
	}
});
