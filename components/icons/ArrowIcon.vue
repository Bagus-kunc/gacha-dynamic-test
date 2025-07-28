<template>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer" @click="handleGoBack">
      <path d="M24.4487 11.5L15.5 20.449L24.4487 29.3977" :stroke="currentColor" stroke-width="3"/>
    </svg> 
</template>

<script setup>

    const props = defineProps({
        handleGoBack: {
            type: Function
        },
        currentColor: {
            type: String,
            default: '#000000'
        }
    })
</script>