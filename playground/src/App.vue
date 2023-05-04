<script lang="ts" setup>
import { ref } from "vue";

const name = ref<number>(1);
</script>

<template>
	<div class="w-full h-100vh">
		{{ name }}
	</div>
</template>

<style scoped>
.container {
	position: relative;
}
</style>
