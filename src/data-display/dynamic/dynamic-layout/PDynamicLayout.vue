<template>
    <component :is="component"
               :name="name"
               :options="options"
               :data="data"
               :fetch-options="fetchOptions"
               :type-options="typeOptions"
               :field-handler="fieldHandler"
               v-on="$listeners"
    >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </component>
</template>

<script lang="ts">
import {
    onMounted, reactive, toRefs, watch,
} from '@vue/composition-api';
import PSkeleton from '@/feedbacks/loading/skeleton/PSkeleton.vue';
import { isEqual } from 'lodash';
import { DynamicLayoutProps } from '@/data-display/dynamic/dynamic-layout/type';
import { DynamicLayoutType, dynamicLayoutTypes } from '@/data-display/dynamic/dynamic-layout/type/layout-schema';
import { AsyncComponent } from 'vue';
import { AsyncComponentPromise } from 'vue/types/options';

const componentMap: Record<DynamicLayoutType, AsyncComponent> = {
    item: () => ({
        component: import('./templates/item/index.vue') as unknown as AsyncComponentPromise,
    }),
    'simple-table': () => ({
        component: import('./templates/simple-table/index.vue') as unknown as AsyncComponentPromise,
    }),
    table: () => ({
        component: import('./templates/table/index.vue') as unknown as AsyncComponentPromise,
    }),
    'query-search-table': () => ({
        component: import('./templates/query-search-table/index.vue') as unknown as AsyncComponentPromise,
    }),
    raw: () => ({
        component: import('./templates/raw/index.vue') as unknown as AsyncComponentPromise,
    }),
    markdown: () => ({
        component: import('./templates/markdown/index.vue') as unknown as AsyncComponentPromise,
    }),
    list: () => ({
        component: import('./templates/list/index.vue') as unknown as AsyncComponentPromise,
    }),
    'raw-table': () => ({
        component: import('./templates/raw-table/index.vue') as unknown as AsyncComponentPromise,
    }),
    html: () => ({
        component: import('./templates/html/index.vue') as unknown as AsyncComponentPromise,
    }),
};
export default {
    name: 'PDynamicLayout',
    components: { PSkeleton },
    props: {
        name: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'item',
        },
        options: {
            type: Object,
            default: () => ({}),
        },
        data: {
            type: [Object, Array, String],
            default: undefined,
        },
        fetchOptions: {
            type: Object,
            default: undefined,
        },
        typeOptions: {
            type: Object,
            default: undefined,
        },
        fieldHandler: {
            type: Function,
            default: undefined,
        },
    },
    setup(props: DynamicLayoutProps) {
        const state = reactive({
            component: null as null|AsyncComponent,
        });

        const getComponent = async () => {
            try {
                if (!dynamicLayoutTypes.includes(props.type)) throw new Error(`[DynamicLayout] Unacceptable Type: layout type must be one of ${dynamicLayoutTypes}. ${props.type} is not acceptable.`);

                state.component = componentMap[props.type];
            } catch (e) {
                console.error(e);
                state.component = componentMap.item;
            }
        };

        watch([() => props.type, () => props.name], (aft, bef) => {
            if (!isEqual(aft, bef)) {
                getComponent();
            }
        }, { immediate: false });

        onMounted(async () => {
            await getComponent();
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>
