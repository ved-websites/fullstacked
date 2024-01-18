<script lang="ts">
	import { twMerge } from '$lib/twMerge';

	let klass = '';
	export { klass as class };

	$: classes = twMerge('s-5', klass);
</script>

<span {...$$restProps} class={classes}></span>
