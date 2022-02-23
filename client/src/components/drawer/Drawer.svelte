<script lang="ts">
	import Drawer, { AppContent, Content, Header, Title, Subtitle, Scrim } from '@smui/drawer';
	import { Icon } from '@smui/common';
	import { Svg } from '@smui/common/elements';
	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';
	import { mdiBookmark, mdiFile, mdiInboxArrowDown, mdiSend, mdiStar } from '@mdi/js';
	import { H6 } from '@smui/common/elements';
	import { isDrawerOpen } from '$/stores';

	let active = 'Inbox';

	function setActive(value: string) {
		active = value;
		isDrawerOpen.set(false);
	}
</script>

<Drawer variant="modal" bind:open={$isDrawerOpen}>
	<Header>
		<Title>Super Mail</Title>
		<Subtitle>It's the best fake mail app drawer.</Subtitle>
	</Header>
	<Content>
		<List>
			<Item
				href="javascript:void(0)"
				on:click={() => setActive('Inbox')}
				activated={active === 'Inbox'}
			>
				<Graphic aria-hidden="true">
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiInboxArrowDown} />
					</Icon>
				</Graphic>
				<Text>Inbox</Text>
			</Item>
			<Item
				href="javascript:void(0)"
				on:click={() => setActive('Star')}
				activated={active === 'Star'}
			>
				<Graphic aria-hidden="true">
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiStar} />
					</Icon>
				</Graphic>
				<Text>Star</Text>
			</Item>
			<Item
				href="javascript:void(0)"
				on:click={() => setActive('Sent Mail')}
				activated={active === 'Sent Mail'}
			>
				<Graphic aria-hidden="true">
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiSend} />
					</Icon>
				</Graphic>
				<Text>Sent Mail</Text>
			</Item>
			<Item
				href="javascript:void(0)"
				on:click={() => setActive('Drafts')}
				activated={active === 'Drafts'}
			>
				<Graphic aria-hidden="true">
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiFile} />
					</Icon>
				</Graphic>
				<Text>Drafts</Text>
			</Item>

			<Separator />
			<Subheader component={H6}>Labels</Subheader>
			<Item
				href="javascript:void(0)"
				on:click={() => setActive('Family')}
				activated={active === 'Family'}
			>
				<Graphic aria-hidden="true">
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiBookmark} />
					</Icon>
				</Graphic>
				<Text>Family</Text>
			</Item>
			<Item
				href="javascript:void(0)"
				on:click={() => setActive('Friends')}
				activated={active === 'Friends'}
			>
				<Graphic aria-hidden="true">
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiBookmark} />
					</Icon>
				</Graphic>
				<Text>Friend</Text>
			</Item>
			<Item
				href="javascript:void(0)"
				on:click={() => setActive('Work')}
				activated={active === 'Work'}
			>
				<Graphic aria-hidden="true">
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiBookmark} />
					</Icon>
				</Graphic>
				<Text>Work</Text>
			</Item>
		</List>
	</Content>
</Drawer>

<Scrim />

<AppContent>
	<slot />
</AppContent>
