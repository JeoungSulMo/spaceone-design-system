<template>
    <div>
        <p-panel-top v-if="layoutName">
            {{ layoutName }}
        </p-panel-top>
        <p-definition-table :fields="fields" :data="rootData" :loading="loading"
                            v-on="$listeners"
        >
            <template v-for="(item, slotName) of dynamicFieldSlots" v-slot:[slotName]="slotProps">
                <p-dynamic-field :key="slotName" v-bind="item"
                                 :handler="fieldHandler"
                />
            </template>
        </p-definition-table>
    </div>
</template>

<script lang="ts">
import {
    ComponentRenderProxy,
    computed, getCurrentInstance, reactive, toRefs,
} from '@vue/composition-api';
import { get } from 'lodash';
import PPanelTop from '@/data-display/titles/panel-top/PPanelTop.vue';
import PDefinitionTable from '@/data-display/tables/definition-table/PDefinitionTable.vue';
import { DefinitionData, DefinitionField } from '@/data-display/tables/definition-table/type';
import {
    ItemDynamicLayoutProps,
} from '@/data-display/dynamic/dynamic-layout/templates/item/type';
import { DynamicFieldProps } from '@/data-display/dynamic/dynamic-field/type';
import PDynamicField from '@/data-display/dynamic/dynamic-field/PDynamicField.vue';
import { DynamicField, ListOptions } from '@/data-display/dynamic/dynamic-field/type/field-schema';
import { getValueByPath } from '@/data-display/dynamic/helper';

export default {
    name: 'PDynamicLayoutItem',
    components: {
        PDynamicField,
        PPanelTop,
        PDefinitionTable,
    },
    props: {
        name: {
            type: String,
            required: true,
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
    setup(props: ItemDynamicLayoutProps) {
        const vm = getCurrentInstance() as ComponentRenderProxy;

        const state = reactive({
            layoutName: computed(() => (props.options.translation_id ? vm.$t(props.options.translation_id) : props.name)),
            fields: computed<DefinitionField[]>(() => {
                if (!props.options.fields) return [];
                const locale = vm.$i18n.locale;
                return props.options.fields.map((d) => {
                    const res = {
                        label: d.options?.translation_id ? vm.$t(d.options.translation_id as string, locale) : d.name,
                        name: d.key,
                    } as DefinitionField;

                    // in case of type 'list', it generate html elements recursively.
                    // it can cause definition's 'showCopy'(flag for showing or not copy button) works wrong.
                    // so should check there is copiable value, and give the result to each field's 'disableCopy' property.
                    if (d.type === 'list') {
                        // eslint-disable-next-line camelcase
                        const subKey = (d.options as ListOptions)?.sub_key as string;
                        const matchedData = get(state.rootData, d.key);
                        if (Array.isArray(matchedData)) {
                            res.disableCopy = matchedData.some(data => !get(data, subKey));
                        } else {
                            res.disableCopy = !get(matchedData, subKey);
                        }
                    }
                    return res;
                });
            }),
            rootData: computed<DefinitionData>(() => {
                if (props.options.root_path) {
                    return get(props.data, props.options.root_path, {});
                }
                if (Array.isArray(props.data) || typeof props.data === 'string') return {};
                return props.data;
            }),
            loading: computed<boolean|undefined>(() => (props.typeOptions === undefined ? undefined : props.typeOptions.loading)),
            timezone: computed<string>(() => props.typeOptions?.timezone || 'UTC'),
        });

        const dynamicFieldSlots = computed(() => {
            const res = {};
            if (!props.options.fields) return res;

            props.options.fields.forEach((ds: DynamicField, i) => {
                const item: DynamicFieldProps = {
                    type: ds.type || 'text',
                    options: { ...ds.options },
                    extraData: { ...ds, index: i },
                    data: getValueByPath(state.rootData, ds.key),
                };

                if (item.options.translation_id) delete item.options.translation_id;

                if (ds.type === 'datetime') {
                    item.typeOptions = { timezone: state.timezone };
                }

                res[`data-${i}`] = item;
            });

            return res;
        });

        return {
            ...toRefs(state),
            dynamicFieldSlots,
        };
    },
};
</script>
