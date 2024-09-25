<template>
    <router-link :to="to"
        class="flex flex-col items-center justify-center w-40 h-40 bg-white shadow-md rounded-lg border hover:bg-gray-50">
        <img :src="icon" alt="Icono" class="w-16 h-16 mb-2" />
        <span class="text-gray-700 text-lg font-semibold">{{ label }}</span>
    </router-link>
</template>

<script>
export default {
    name: 'ButtonCard',
    props: {
        label: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        }
    }
}
</script>

