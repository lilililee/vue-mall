<template>
	<div class="position">
		<div class="container">
			<router-link to="/" class="heme">
				首页
			</router-link> /
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'v-position',
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';
	
	.position {
		height: 45px;
		line-height: 45px;
		background: #f0f0f0;

		a {
			@include transition;

			&:hover {
				color: $c1;
			}
		}

		span {
			color: $c1;
		}

		@media (max-width: 768px)  {
			display: none;
		}
	}
</style>