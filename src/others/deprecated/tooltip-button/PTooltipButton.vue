<template>
    <div>
        <p-tooltip :contents="tooltip" :position="position" :options="options"
                   v-on="$listeners"
        >
            <span class="inline-flex">
                <slot name="button" :active="active">
                    <p-button ref="button" class="tooltip-btn" :class="{
                        active: active,
                        [theme]: true
                    }"
                    >
                        <slot name="buttonContents">
                            {{ contents }}
                        </slot>
                    </p-button>
                </slot>
            </span>
        </p-tooltip>
    </div>
</template>

<script lang="ts">
import { merge } from 'lodash';
import PTooltip from '@/data-display/tooltips/PTooltip.vue';
import PButton from '@/inputs/buttons/button/PButton.vue';

export default {
    name: 'PTooltipButton',
    events: ['click'],
    components: {
        PTooltip,
        PButton,
    },
    props: {
        contents: {
            type: String,
            default: null,
        },
        tooltip: {
            type: String,
            default: null,
        },
        tooltipOptions: {
            type: Object,
            default: () => ({}),
        },
        position: {
            type: String,
            default: 'right',
        },
        active: {
            type: Boolean,
            default: false,
        },
        theme: {
            type: String,
            default: 'primary-dark',
            validator(theme: any) {
                return ['primary-dark', 'transparent'].includes(theme);
            },
        },
    },
    computed: {
        options() {
            return merge({
                hideOnTargetClick: true,
            }, (this as any).tooltipOptions);
        },
    },
};
</script>

<style scoped lang="postcss">

@define-mixin theme $theme, $color {
    &.$(theme) {
        &:hover, &.active {
            background-color: $color;
        }
    }
}
.tooltip-btn {
    @apply text-primary4 rounded-sm;
    display: inline-block;
    padding: 0;
    border: 0;
    min-width: 32px;
    line-height: 1;

    @mixin theme primary-dark, theme('colors.primary-dark');
    @mixin theme transparent, transparent;
}

</style>
