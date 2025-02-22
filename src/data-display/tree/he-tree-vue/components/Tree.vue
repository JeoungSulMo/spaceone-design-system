<script lang="jsx">
import * as hp from 'helper-js';
import * as vf from 'vue-functions';
import * as ut from '../utils';

const trees = {};

const Tree = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(h) {
        // convert undefined to empty str
        const noUndefined = str => (str || '');
        // tree tpl, to render recursively
        const childrenListTpl = (nodes, parent, parentPath) => {
            const indentStyle = { [!this.rtl ? 'paddingLeft' : 'paddingRight']: `${parentPath.length * this.indent}px` };
            const branchTpl = (node, index) => {
                const path = [...parentPath, index];
                const transitionComponent = this.foldingTransition || 'transition';
                const slotDefault = () => {
                    const original = () => {
                        if (this.$scopedSlots.default) {
                            return this.$scopedSlots.default({
                                node, index, path, tree: this,
                            });
                        } if (this.$slots.default) {
                            return this.$slots.default;
                        }
                        return node.text;
                    };
                    if (this.overrideSlotDefault) {
                        return this.overrideSlotDefault({
                            node, index, path, tree: this,
                        }, original);
                    }
                    return original();
                };
                let nodebackStyle = indentStyle;
                if (node.$nodeBackStyle) {
                    nodebackStyle = { ...nodebackStyle, ...node.$nodeBackStyle };
                }
                return <div class={`tree-branch ${noUndefined(node.$branchClass)} ${noUndefined(node.$hidden && 'he-tree--hidden')}`}
                    style={node.$branchStyle || {}}
                    data-tree-node-path={path.join(',')}
                >
                    <div class={`tree-node-back ${noUndefined(node.$nodeBackClass)}`} style={nodebackStyle || {}}>
                        <div class={`tree-node ${noUndefined(node.$nodeClass)}`} style={node.$nodeStyle || {}}>
                            {slotDefault()}
                        </div>
                    </div>
                    {(node.children && node.children.length) > 0 && <transitionComponent name={this.$props.foldingTransitionName}>
                        {!node.$folded && childrenListTpl(node.children, node, path)}
                    </transitionComponent>}
                </div>;
            };
            return <div class={`tree-children ${noUndefined(parent === this.rootNode && 'tree-root')} ${noUndefined(parent.$childrenClass)}`}
                style={parent.$childrenStyle || {}}
            >
                {nodes.map(branchTpl)}
            </div>;
        };
        return <div class={`he-tree ${this.treeClass} ${noUndefined(this.rtl && 'he-tree--rtl')}`} data-tree-id={this.treeId}>
            {this.blockHeader && this.blockHeader()}
            {childrenListTpl(this.rootNode.children, this.rootNode, [])}
            {this.blockFooter && this.blockFooter()}
        </div>;
    },
    mixins: [
        vf.updatablePropsEvenUnbound({
            value: { $localName: 'treeData', required: true },
        }),
        vf.hookHelper,
    ],
    props: {
        indent: { type: Number, default: 20 },
        rtl: { type: Boolean },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        rootNode: { default: is => ({}) },
    },
    // components: {},
    data() {
        return {
            trees,
            treeClass: '',
            treeId: hp.randString(),
        };
    },
    // computed: {},
    watch: {
        treeData: {
            immediate: true,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            handler(treeData) {
                this._TreeDataHelper = new hp.TreeData(this.treeData);
            },
        },
    },
    methods: {
        iteratePath(path, opt) {
            return this._TreeDataHelper.iteratePath(path, opt);
        },
        getTreeVmByTreeEl(treeEl) {
            return this.trees[treeEl.getAttribute('data-tree-id')];
        },
        getAllNodesByPath(path) {
            return this._TreeDataHelper.getAllNodes(path);
        },
        getNodeByPath(path) {
            return this._TreeDataHelper.getNode(path);
        },
        getPathByBranchEl(branchEl) {
            return branchEl.getAttribute('data-tree-node-path').split(',').map(v => parseInt(v));
        },
        getBranchElByPath(path) {
            return this.$el.querySelector(`[data-tree-node-path='${path.join(',')}']`);
        },
        getNodeByBranchEl(branchEl) {
            return this.getNodeByPath(this.getPathByBranchEl(branchEl));
        },
        getNodeParentByPath(path) {
            return this._TreeDataHelper.getNodeParent(path);
        },
        removeNodeByPath(path) {
            return this._TreeDataHelper.removeNode(path);
        },
        walkTreeData(handler, opt) {
            return ut.walkTreeData(this.treeData, handler, opt);
        },
        cloneTreeData(opt) {
            return ut.cloneTreeData(this.treeData, opt);
        },
        // return cloned new tree data without property witch starts with `$`
        getPureTreeData() {
            return ut.getPureTreeData(this.treeData);
        },
    },
    created() {
        //
        const updateRootNode = () => { this.$set(this.rootNode, 'children', this.treeData); };
        this.$watch('rootNode', updateRootNode, { immediate: true });
        this.$watch('treeData', updateRootNode, { immediate: true });
    },
    mounted() {
        //
        this.treeId = hp.randString();
        this.$set(this.trees, this.treeId, this);
        this.$once('hook:beforeDestroy', () => {
            this.$delete(this.trees, this.treeId);
        });
    },
    // beforeDestroy() {},

    //
    mixPlugins(plugins) {
        const MixedTree = {
            name: 'Tree',
            extends: Tree,
            mixins: plugins,
            mixPlugins: this.mixPlugins,
        };
        return MixedTree;
    },
};
export default Tree;

</script>
