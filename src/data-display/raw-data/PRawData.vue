<template>
    <p-text-editor ref="editor" class="p-raw-data" :code="code"
                   mode="readOnly" :loading="loading" :folded="folded"
    />
</template>

<script lang="ts">
import {
    computed, reactive, toRefs,
} from '@vue/composition-api';
import PTextEditor from '@/inputs/text-editor/PTextEditor.vue';

export default {
    name: 'PRawData',
    components: {
        PTextEditor,
    },
    props: {
        item: {
            type: [Object, Array, String],
            default: () => ({}),
        },
        raw: {
            type: String,
            default: undefined,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        folded: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const state = reactive({
            // proxyCode: undefined,
            editor: null,
        });
        return {
            code: computed(() => props.raw || JSON.stringify(props.item, undefined, 4)),
            ...toRefs(state),
        };
    },

};
</script>
<style lang="postcss" >
.p-raw-data {
    @apply w-auto;
}
</style>
