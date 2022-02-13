import type { NavbarConfig } from "@vuepress/theme-default";

export const en: NavbarConfig = [
	{
		text: "Why?",
		link: "/why.md"
	},
	{
		text: "Guide",
		link: "/guide/"
	},
	{
		text: "Reference",
		children: [
			"/reference/scripts.md",
			"/reference/benchmarks.md",
			"/reference/ratings.md",
			"/reference/create-host.md",
			"/reference/proxy.md",
			{
				text: "Backend (NestJS)",
				children: [
					{
						text: "Project Documentation",
						link: "/reference/backend.md"
					},
					{
						text: "Postman API",
						link: "https://www.postman.com/troncali/workspace/nest-vue"
					}
				]
			},
			{
				text: "Frontend (Vue)",
				children: [
					{
						text: "Project Documentation",
						link: "/reference/frontend.md"
					}
				]
			}
		]
	},
	{
		text: "Demo",
		link: "/demo/"
	}
];
