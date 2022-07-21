import { DefaultTheme } from "vitepress";

export const en: DefaultTheme.NavItem[] = [
	{
		text: "Why?",
		link: "/guide/why.md"
	},
	{
		text: "Guide",
		link: "/guide/index.md"
	},
	{
		text: "Reference",
		items: [
			{
				text: "Yarn Scripts",
				link: "/reference/scripts.md"
			},
			{
				text: "Benchmarks",
				link: "/reference/benchmarks.md"
			},
			{
				text: "SSL & Other Ratings",
				link: "/reference/ratings.md"
			},
			{
				text: "Create A Host",
				link: "/reference/create-host.md"
			},
			{
				text: "Multi-Project Proxy",
				link: "/reference/proxy.md"
			},
			{
				text: "Backend (NestJS)",
				items: [
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
				items: [
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
		link: "/demo/index.md"
	}
];
