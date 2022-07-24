import { DefaultTheme } from "vitepress";

export const en: DefaultTheme.Sidebar = {
	"/guide/": [
		{
			text: "Introduction",
			collapsible: true,
			items: [
				{
					text: "Why?",
					link: "/guide/why.md"
				},
				{
					text: "The Stack",
					link: "/guide/index.md"
				},
				{
					text: "Setup",
					link: "/guide/setup.md"
				},
				{
					text: "Deploy",
					link: "/guide/deploy.md"
				},
				{
					text: "Customize",
					link: "/guide/customize.md"
				}
			]
		},
		{
			text: "Backend",
			collapsible: true,
			items: [
				{
					text: "Structure",
					link: "/guide/backend/index.md"
				},
				{
					text: "Commands",
					link: "/guide/backend/commands.md"
				},
				{
					text: "Configuration",
					link: "/guide/backend/configuration.md"
				},
				{
					text: "Data Access",
					link: "/guide/backend/data.md"
				},
				{
					text: "Models",
					link: "/guide/backend/models.md"
				},
				{
					text: "Authentication",
					link: "/guide/backend/auth.md"
				}
			]
		},
		{
			text: "Frontend",
			collapsible: true,
			items: [
				{
					text: "Structure",
					link: "/guide/frontend/index.md"
				},
				{
					text: "Commands",
					link: "/guide/frontend/commands.md"
				}
			]
		},
		{
			text: "Deployment",
			collapsible: true,
			collapsed: true,
			items: [
				{
					text: "Commands",
					link: "/guide/deployment/commands.md"
				},
				{
					text: "Docker",
					link: "/guide/deployment/docker.md"
				},
				{
					text: "Kubernetes",
					link: "/guide/deployment/kubernetes.md"
				},
				{
					text: "Jenkins",
					link: "/guide/deployment/jenkins.md"
				}
			]
		},
		{
			text: "Containers",
			collapsible: true,
			collapsed: true,
			items: [
				{
					text: "Backend",
					link: "/guide/containers/backend.md"
				},
				{
					text: "Certbot",
					link: "/guide/containers/certbot.md"
				},
				{
					text: "Database",
					link: "/guide/containers/db.md"
				},
				{
					text: "Migrator",
					link: "/guide/containers/migrator.md"
				},
				{
					text: "NGINX",
					link: "/guide/containers/nginx.md"
				},
				{
					text: "Placeholder",
					link: "/guide/containers/placeholder.md"
				},
				{
					text: "Worker",
					link: "/guide/containers/worker.md"
				}
			]
		},
		{
			text: "Tools",
			collapsible: true,
			collapsed: true,
			items: [
				{
					text: "Nx",
					link: "/guide/tools/nx.md"
				},
				{
					text: "Yarn",
					link: "/guide/tools/yarn.md"
				}
			]
		}
	],
	"/reference/": [
		{
			text: "Reference",
			collapsible: true,
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
				}
			]
		},
		{
			text: "Backend (NestJS)",
			collapsible: true,
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
			collapsible: true,
			items: [
				{
					text: "Project Documentation",
					link: "/reference/frontend.md"
				}
			]
		}
	]
};
