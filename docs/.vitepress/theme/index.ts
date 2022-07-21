import DefaultTheme from "vitepress/theme";

import CodeGroup from "../components/CodeGroup";
import CodeGroupItem from "../components/CodeGroupItem.vue";

export default {
	...DefaultTheme,
	enhanceApp({ app }) {
		// register global components
		app.component("CodeGroup", CodeGroup);
		app.component("CodeGroupItem", CodeGroupItem);
	}
};
