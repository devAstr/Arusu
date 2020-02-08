<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container">
            <div class="overflow-auto">
                <h4>為什麼一直斷線</h4>
                <p>Cloudflare 會切斷 100 秒未響應的連線</p>
                <p>而原伺服器會切斷 90 秒未響應的連線</p>
                <p>使用手機時當瀏覽器於背景工作最有可能發生</p>
                <h4 class="mt-5">如何累積 Sync</h4>
                <p>目前只有登入的使用者能夠累積 Sync</p>
                <p>大約一小時累積 1 點，上限 200 點</p>
            </div>
            <button @click="$emit('close')" class="btn btn-outline-secondary mt-4" type="button">
                關閉
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';

    @Component({components: {ModalBase}})
    export default class Help extends mixins(ModalBase) {
    }
</script>

<style scoped>
    @import '@/assets/modal.css';
</style>

