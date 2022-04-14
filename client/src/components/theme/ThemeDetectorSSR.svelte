<!-- prettier-ignore -->
<script lang="ts">
	import { browser } from '$app/env';
	import { inlineThemeVarSetter } from './InlineThemeSetter';
	
	// Using a variable from another file as inline
	// scripts, even in strings, are buggy in svelte files.
</script>

{#if !browser}
	{@html inlineThemeVarSetter}
{/if}
