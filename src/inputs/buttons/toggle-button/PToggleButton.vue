<template>
    <toggle-button
        :value="value"
        :sync="sync"
        :color="colors"
        :width="32"
        :height="16"
        :margin="2"
        :disabled="disabled"
        v-on="$listeners"
    />
</template>

<script lang="ts">
import { ToggleButton } from 'vue-js-toggle-button';

import {
    defineComponent, computed, reactive, toRefs,
} from '@vue/composition-api';
import { TOGGLE_BUTTON_THEME } from '@/inputs/buttons/toggle-button/config';
import { ToggleButtonProps } from '@/inputs/buttons/toggle-button/type';
import color from '@/styles/colors';

/**
 * Used library: vue-js-toggle-button
 * https://www.npmjs.com/package/vue-js-toggle-button
 */

export default defineComponent<ToggleButtonProps>({
    name: 'PToggleButton',
    components: {
        ToggleButton,
    },
    props: {
        sync: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Boolean,
            default: false,
        },
        theme: {
            type: String,
            default: TOGGLE_BUTTON_THEME.secondary,
            validator(theme: TOGGLE_BUTTON_THEME) {
                return Object.values(TOGGLE_BUTTON_THEME).includes(theme);
            },
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    setup(props: ToggleButtonProps) {
        const state = reactive({
            colors: computed(() => {
                if (props.theme === 'secondary') return { checked: color.blue[500], unchecked: color.gray[300] };
                if (props.theme === 'peacock500') return { checked: color.peacock[400], unchecked: color.gray[300] };
                return { checked: color.blue[500], unchecked: color.gray[300] };
            }),
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>
