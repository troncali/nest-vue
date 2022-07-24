<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "CodeGroupItem"
	});
</script>

<script setup lang="ts">
	// From Vuepress Default Theme: https://github.com/vuepress/vuepress-next/blob/main/packages/%40vuepress/theme-default/src/client/components/global/CodeGroupItem.vue
	defineProps({
		title: {
			type: String,
			required: true
		},
		active: {
			type: Boolean,
			required: false,
			default: false
		}
	});
</script>

<template>
	<div
		class="code-group-item"
		:class="{ 'code-group-item__active': active }"
		:aria-selected="active"
	>
		<slot />
	</div>
</template>

<style lang="scss">
	/**
	 * code-group
	  */
	.code-group__nav {
		margin-top: 0.85rem !important;
		// 2 * margin + border-radius of <pre> tag
		margin-bottom: calc(-1.7rem - 6px) !important;
		padding-bottom: calc(1.7rem - 6px) !important;
		padding-left: 10px !important;
		padding-top: 10px !important;
		border-top-left-radius: 6px !important;
		border-top-right-radius: 6px !important;
		background-color: var(--vp-code-block-bg) !important;
	}

	.code-group__ul {
		margin: auto 0 !important;
		padding-left: 0 !important;
		display: inline-flex !important;
		list-style: none !important;
	}

	.code-group__li {
		margin-top: unset !important;
	}

	.code-group__nav-tab {
		border: 0 !important;
		padding: 5px !important;
		cursor: pointer !important;
		background-color: transparent !important;
		font-size: 0.85em !important;
		line-height: 1.4 !important;
		color: rgba(255, 255, 255, 0.9) !important;
		font-weight: 600 !important;
	}

	.code-group__nav-tab:focus {
		outline: none !important;
	}

	.code-group__nav-tab:focus-visible {
		outline: 1px solid rgba(255, 255, 255, 0.9) !important;
	}

	.code-group__nav-tab-active {
		border-bottom: var(--vp-c-brand) 1px solid !important;
	}

	@media (max-width: 419px) {
		.code-group__nav {
			margin-left: -1.5rem !important;
			margin-right: -1.5rem !important;
			border-radius: 0 !important;
		}
	}

	/**
	 * code-group-item
	  */
	.code-group-item {
		display: none !important;
	}

	.code-group-item__active {
		display: block !important;
	}

	.code-group-item > pre {
		background-color: orange !important;
	}
</style>
