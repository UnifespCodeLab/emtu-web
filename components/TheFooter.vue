<template>
	<v-footer padless>
		<v-card
			flat
			tile
			width="100%"
			class="primary text-center"
		>
			<v-card-text>
				<v-btn
					v-for="icon in icons"
					:key="icon.name"
					:href="icon.link"
					class="mx-4"
					target="_blank"
					icon
				>
					<v-icon 
						color="white"
						size="24px"
					>
						{{ icon.name }}
					</v-icon>
				</v-btn>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-text>
				<v-btn
					color="white"
					to="/solicitacao"
					small
					text
				>
					Não encontrou sua rota? Solicite uma aqui! 
				</v-btn>
			</v-card-text>
		</v-card>
	</v-footer>
</template>

<script>
export default {
  name: 'TheFooter',
	data() {
		return {
			icons: [
				{ name: 'mdi-linkedin', link: '' },
				{ name: 'mdi-email', link: '' },
				{ name: 'mdi-github', link: '' },
			],
		};
	},
}
</script>
