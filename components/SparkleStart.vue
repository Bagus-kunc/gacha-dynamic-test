<template>
    <div class="blinking-start" :class="[className]">
        <img :src="startIcon" alt="start icon" class="start-icon" :class="[imageStyle]" />
    </div>
</template>

<script setup>
import startIcon from "/public/images/stars.png"

    const props = defineProps({
        className: String,
        imageStyle: String,
    })

</script>

<style scoped>
.blinking-start {
    position: absolute;
    animation: blink 1s ease-in-out infinite;
}

.start-icon {
    transition: opacity 0.5s ease;
}

@keyframes blink {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.3;
    }
}
</style>