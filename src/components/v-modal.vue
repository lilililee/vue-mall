<template>
	<div class="md-overlay" :class="{'md-overlay-show':isShow}">
		<div class="md-modal" :class="{'md-modal-show':isShow}">
			<i class="iconfont icon-guanbi01 close"  @click="close"></i>

			<slot name="msg"></slot>
			<slot name="btns"></slot>

		</div>
	</div>
</template>

<script>
	export default {
		name: '',
		data() {
			return {

			}
		},
		props: {
			isShow: Boolean
		},
		methods: {
			close(){
				this.$emit('update:isShow',false);
			}
		}
	}
</script>
