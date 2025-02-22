import {
    number, boolean, text, withKnobs,
} from '@storybook/addon-knobs';
import PPageTitle from '@/data-display/titles/page-title/PPageTitle.vue';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Data Display/Titles/Page Title',
    component: PPageTitle,
    decorators: [withKnobs],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/wq4wSowBcADBuUrMEZLz6i/SpaceONE-Console-Design?node-id=6132%3A124065',
        },
    },
};

export const pageTitle = () => ({
    components: { PPageTitle },
    template: '<PPageTitle v-bind="$props"></PPageTitle>',
    props: {
        title: {
            type: String,
            default: text('title', 'Page Title'),
        },
        child: {
            type: Boolean,
            default: boolean('child', false),
        },
        useTotalCount: {
            type: Boolean,
            default: boolean('use Total Count', true),
        },
        useSelectedCount: {
            type: Boolean,
            default: boolean('use Selected Count', false),
        },
        totalCount: {
            type: Number,
            default: number('Total Count', 10),
        },
        selectedCount: {
            type: Number,
            default: number('Selected Count', 2),
        },
    },
    setup() {
        return {
            goBack: action('goBack'),
        };
    },
});

export const childMode = () => ({
    components: { PPageTitle },
    template: `
        <PPageTitle
          v-bind="$props"
          @goBack="goBack"
        >

        </PPageTitle>`,
    props: {
        child: {
            type: Boolean,
            default: boolean('child', true),
        },
    },
    setup() {
        return {
            goBack: action('goBack'),
        };
    },
});
export const selectedCount = () => ({
    components: { PPageTitle },
    template: '<PPageTitle v-bind="$props"></PPageTitle>',
    props: {
        useTotalCount: {
            type: Boolean,
            default: boolean('use Total Count', true),
        },
        useSelectedCount: {
            type: Boolean,
            default: boolean('use Selected Count', true),
        },
        totalCount: {
            type: Number,
            default: number('Total Count', 10),
        },
        selectedCount: {
            type: Number,
            default: number('Selected Count', 2),
        },
    },
    setup() {
        return {
        };
    },
});
