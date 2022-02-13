import type { SidebarConfig } from "@vuepress/theme-default";

export const en: SidebarConfig = {
	"/guide/": [
		"/guide/",
		"/guide/setup.md",
		"/guide/deploy.md",
		"/guide/docker/",
		"/guide/backend.md",
		"/guide/frontend.md",
		"/guide/docker/nginx.md",
		"/guide/docker/db.md",
		"/guide/docker/certbot.md",
		"/guide/jenkins.md",
		"/guide/nx.md",
		"/guide/yarn.md"
	],
	"/reference/": [
		"/reference/scripts.md",
		"/reference/benchmarks.md",
		"/reference/ratings.md",
		"/reference/create-host.md",
		"/reference/proxy.md",
		{
			text: "Backend (NestJS)",
			collapsible: true,
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
			collapsible: true,
			children: [
				{
					text: "Project Documentation",
					link: "/reference/frontend.md"
				}
			]
		}
	]
};
