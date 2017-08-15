<template>
	<footer class="footer">
		<div class="container">
			<span class="copyright">Copyright © 2017 IMooc All Rights Reserved.</span>
			<a href="#">About Us</a>
			<a href="#">Terms & Conditions</a>
			<a href="#">Privacy Policy</a>
		</div>
	</footer>
</template>

<script>
	export default {
		name: 'v-footer',
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';
	
	.footer {
		height: 100px;
		line-height: 100px;
		color: #666;
		margin-top: 70px;
		font-size: 13px;
		text-align: right;
		.container {
			border-top: 1px solid #ddd;
		}

		a , span {
			margin-left: 35px;
		}

		@media (max-width:768px) {
			.container {
				padding: 10px 0;
			}
			
			height: 35px;
			line-height: 35px;

			margin-top: 20px;
			text-align: center;

			a , span {
				margin-left: 0;
				display: block;
			}
		}
	}
</style>