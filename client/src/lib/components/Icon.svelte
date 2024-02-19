<script lang="ts">
	import { cn } from '$lib/twMerge';

	let klass = '';
	export { klass as class };

	$: classes = cn('s-5', klass);
</script>

<span {...$$restProps} class={classes}></span>
