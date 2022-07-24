<script setup lang="ts">
	import WelcomeItem from "./WelcomeItem.vue";
	import ServerIcon from "./icons/IconServer.vue";
	import ToolingIcon from "./icons/IconTooling.vue";
	import EcosystemIcon from "./icons/IconEcosystem.vue";
	import BackendIcon from "./icons/IconBackend.vue";
</script>

<template>
	<WelcomeItem>
		<template #icon>
			<ServerIcon />
		</template>
		<template #heading>Environment</template>

		This monorepo example is running on a basic DigitalOcean droplet with
		1vCPU, 1GB memory, and 25GB SSD in a US‑West data center.
	</WelcomeItem>

	<WelcomeItem>
		<template #icon>
			<BackendIcon />
		</template>
		<template #heading>Backend</template>

		<code>NGINX</code> serves the <code>frontend</code>,
		<a target="_blank" href="https://staging-nest-vue.troncali.com/"
			><code>staging</code></a
		>
		behind basic authentication, and proxies <code>backend</code> paths like
		<a target="_blank" href="https://nest-vue.troncali.com/api"
			><code>/api</code></a
		>. Use Postman to
		<a
			target="_blank"
			href="https://www.postman.com/troncali/workspace/nest-vue"
			>explore the API</a
		>.
	</WelcomeItem>

	<WelcomeItem>
		<template #icon>
			<ToolingIcon />
		</template>
		<template #heading>Tooling</template>

		The frontend is served (in development) and bundled with
		<a href="https://vitejs.dev/guide/features.html" target="_blank">Vite</a
		>. The recommended IDE setup is
		<a href="https://code.visualstudio.com/" target="_blank">VSCode</a> +
		<a href="https://github.com/johnsoncodehk/volar" target="_blank"
			>Volar</a
		>
		+
		<a target="_blank" href="https://github.com/vuejs/devtools"
			>Vue Dev Tools</a
		>.
	</WelcomeItem>

	<WelcomeItem>
		<template #icon>
			<EcosystemIcon />
		</template>
		<template #heading>Ecosystem</template>

		Base template configured with
		<a target="_blank" href="https://pinia.vuejs.org/">Pinia</a> for state,
		<a target="_blank" href="https://router.vuejs.org/">Vue Router</a>,
		<a target="_blank" href="https://tailwindcss.com/">Tailwind</a>, and
		<a target="_blank" href="https://vitest.dev">Vitest</a> and
		<a
			target="_blank"
			href="https://docs.cypress.io/guides/component-testing/writing-your-first-component-test"
			>Cypress</a
		>
		for testing. See more at
		<a target="_blank" href="https://github.com/vuejs/awesome-vue"
			>Awesome Vue</a
		>.
	</WelcomeItem>
</template>
