<template>
</template>

<script lang="ts">
    import {Component, Vue} from 'nuxt-property-decorator';

    @Component
    export default class Default extends Vue {
        created() {
            this.$router.replace('/');
        }
    }
</script>
