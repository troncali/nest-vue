import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "url";

import { navbar } from "./configs";
import { sidebar } from "./configs";

export default defineConfig({
	base: "/",
	outDir: "../dist/docs/vitepress",

	// site config
	lang: "en-US",
	title: "nest-vue",
	description: "Full-stack monorepo starter",

	// theme and its config
	themeConfig: {
		logo: "/images/logo.png",
		siteTitle: "nest‑vue",
		nav: navbar.en,
		sidebar: sidebar.en,
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/troncali/nest-vue"
			}
		],
		editLink: {
			pattern: "https://github.com/troncali/nest-vue/edit/main/docs/:path"
		},
		footer: {
			message: "MIT Licensed.",
			copyright: "Copyright © 2020-present Matt Troncali"
		}
	},
	vite: {
		publicDir: "./.vitepress/public",
		cacheDir: "../.yarn/cache/vitepress",
		server: {
			port: 9998,
			strictPort: true,
			open: true
		}
	},
	markdown: {
		theme: "github-dark-dimmed"
	}
});
