<script lang="ts">
import * as hp from 'helper-js';
import { Draggable, Store } from '@/data-display/tree/he-tree-vue/types';
import * as ut from '../../utils';
import makeTreeDraggable from './draggable';

const treesStore = {} as {store: Store};

export default {
    props: {
        triggerClass: { type: [String, Array], default: 'tree-node' },
        triggerBySelf: { type: Boolean },
        draggable: { type: [Boolean, Function], default: true },
        droppable: { type: [Boolean, Function], default: true },
        eachDraggable: { type: [Function] }, // type: [Boolean, Function]
        eachDroppable: { type: [Function] }, // type: [Boolean, Function]
        ondragstart: { type: Function },
        ondragend: { type: Function },
        unfoldWhenDragover: { type: Boolean, default: true },
        unfoldWhenDragoverDelay: { type: Number, default: 30 },
        draggingNodePositionMode: { type: String, default: 'top_left_corner' }, // top_left_corner, mouse
        edgeScroll: { type: Boolean },
        edgeScrollTriggerMargin: { type: Number, default: 50 },
        edgeScrollSpeed: { type: Number, default: 0.35 },
        edgeScrollTriggerMode: { type: String, default: 'top_left_corner' },
        edgeScrollSpecifiedContainerX: {}, // HTMLElement || ((store) => HTMLElement)
        edgeScrollSpecifiedContainerY: {}, // HTMLElement || ((store) => HTMLElement)
        preventTextSelection: { type: Boolean, default: true },
    },
    data() {
        return {
            treesStore,
        };
    },
    mounted() {
        // @ts-ignore
        // eslint-disable-next-line no-multi-assign
        const options = this._draggableOptions = {
            // @ts-ignore
            indent: this.indent,
            // @ts-ignore
            triggerClass: this.triggerClass,
            // @ts-ignore
            triggerBySelf: this.triggerBySelf,
            // @ts-ignore
            unfoldWhenDragover: this.unfoldWhenDragover,
            // @ts-ignore
            unfoldWhenDragoverDelay: this.unfoldWhenDragoverDelay,
            // @ts-ignore
            draggingNodePositionMode: this.draggingNodePositionMode,
            // @ts-ignore
            cloneWhenDrag: this.cloneWhenDrag,
            // @ts-ignore
            edgeScroll: this.edgeScroll,
            // @ts-ignore
            edgeScrollTriggerMargin: this.edgeScrollTriggerMargin,
            // @ts-ignore
            edgeScrollSpeed: this.edgeScrollSpeed,
            // @ts-ignore
            edgeScrollTriggerMode: this.edgeScrollTriggerMode,
            // @ts-ignore
            edgeScrollSpecifiedContainerX: this.edgeScrollSpecifiedContainerX,
            // @ts-ignore
            edgeScrollSpecifiedContainerY: this.edgeScrollSpecifiedContainerY,
            // @ts-ignore
            rtl: this.rtl,
            // @ts-ignore
            preventTextSelection: this.preventTextSelection,
            treeClass: 'he-tree',
            rootClass: 'tree-root',
            childrenClass: 'tree-children',
            branchClass: 'tree-branch',
            nodeClass: 'tree-node',
            nodeBackClass: 'tree-node-back',
            placeholderClass: 'tree-placeholder',
            placeholderNodeBackClass: 'tree-placeholder-node-back',
            placeholderNodeClass: 'tree-placeholder-node',
            draggingClass: 'dragging',
            placeholderId: 'he_tree_drag_placeholder',
            ifNodeFolded: (branchEl, store) => {
                const { targetTree } = store;
                const node = targetTree.getNodeByBranchEl(branchEl);
                return node.$folded;
            },
            isTargetTreeRootDroppable: (store) => {
                const droppable = hp.resolveValueOrGettter(store.targetTree.rootNode.$droppable, [store.targetTree, store]);
                if (droppable !== undefined) {
                    return droppable;
                }
                return true;
            },
            // @ts-ignore
            unfoldTargetNodeByEl: (...args) => this._Draggable_unfoldTargetNodeByEl(...args),
            isNodeParentDroppable: (branchEl, treeEl) => {
                // @ts-ignore
                const tree = this.getTreeVmByTreeEl(treeEl);
                const path = tree.getPathByBranchEl(branchEl);
                const parentPath = hp.arrayWithoutEnd(path, 1);
                const parent = tree.getNodeByPath(parentPath);
                return tree.isNodeDroppable(parent, parentPath);
            },
            isNodeDroppable: (branchEl, treeEl) => {
                // @ts-ignore
                const tree = this.getTreeVmByTreeEl(treeEl);
                const path = tree.getPathByBranchEl(branchEl);
                const node = tree.getNodeByPath(path);
                return tree.isNodeDroppable(node, path);
            },
            // eslint-disable-next-line consistent-return
            _findClosestDroppablePosition: (branchEl, treeEl) => {
                // @ts-ignore
                const tree = this.getTreeVmByTreeEl(treeEl);
                const path = tree.getPathByBranchEl(branchEl);
                const findPath = hp.arrayWithoutEnd(path, 1);
                let cur = path;
                // eslint-disable-next-line no-restricted-syntax,no-shadow
                for (const { node, path } of tree.iteratePath(findPath, { reverse: true })) {
                    if (tree.isNodeDroppable(node, path)) {
                        return tree.getBranchElByPath(cur);
                    }
                    cur = path;
                }
                // @ts-ignore
                if (tree.isNodeDroppable(this.rootNode, [])) {
                    return tree.getBranchElByPath(cur);
                }
            },
            afterPlaceholderCreated: (store) => {
                store.startTree.$emit('afterPlaceholderCreated', store);
                store.startTree.$emit('after-placeholder-created', store);
            },
            // @ts-ignore
            getPathByBranchEl: branchEl => this.getPathByBranchEl(branchEl),
            // eslint-disable-next-line consistent-return
            beforeFirstMove: (store) => {
                // @ts-ignore
                this.treesStore.store = store;
                // @ts-ignore
                store.startTree = this.getTreeVmByTreeEl(store.startTreeEl);
                const draggable = hp.resolveValueOrGettter(store.startTree.draggable, [store.startTree, store]);
                if (!draggable) {
                    return false;
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { startTree, dragBranchEl, startPath } = store;
                store.dragNode = startTree.getNodeByPath(startPath);
                // @ts-ignore
                if (this.cloneWhenDrag) {
                    store.dragNode = ut.cloneTreeData(store.dragNode);
                }
                if (!startTree.isNodeDraggable(store.dragNode, startPath)) {
                    return false;
                }
                if (startTree.hasHook('ondragstart') && startTree.executeHook('ondragstart', [startTree, store]) === false) {
                    return false;
                }
                store.startTree.$emit('before-first-move', store);
                store.startTree.$emit('drag', store);
                // @ts-ignore
                this.$root.$emit('he-tree-drag', store);
            },
            // eslint-disable-next-line consistent-return
            filterTargetTree: (targetTreeEl, store) => {
                // @ts-ignore
                const targetTree = this.getTreeVmByTreeEl(targetTreeEl);
                const { startTree } = store;
                if (startTree !== targetTree) {
                    // @ts-ignore
                    if (this._internal_hook_filterTargetTree) {
                        // @ts-ignore
                        if (this._internal_hook_filterTargetTree(targetTree, store) === false) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                const targetTreeDroppable = hp.resolveValueOrGettter(targetTree.droppable, [targetTree, store]);
                if (!targetTreeDroppable) {
                    return false;
                }
                store.targetTree = targetTree;
                // @ts-ignore
                if (!hp.resolveValueOrGettter(store.startTree === store.targetTree) && hp.resolveValueOrGettter(this._Draggable_unfoldTargetNode, [false, this.treeData]) !== this.rootNode.children) {
                    return false;
                }
            },
            afterMove: (store) => {
                store.startTree.$emit('after-move', store);
            },
            // eslint-disable-next-line consistent-return
            beforeDrop: (pathChanged, store) => {
                const { targetTree } = store;
                if (targetTree.hasHook('ondragend') && targetTree.executeHook('ondragend', [targetTree, store]) === false) {
                    return false;
                }
                // @ts-ignore
                this.$root.$emit('he-tree-before-drop', store);
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars,consistent-return
            afterDrop: (store, t) => {
                if (store.pathChanged) {
                    const {
                        startTree, targetTree, startPath, dragNode,
                    } = store;
                    let { targetPath } = store;
                    // @ts-ignore
                    if (this.cloneWhenDrag !== true) {
                        // remove from start position
                        const startParentPath = hp.arrayWithoutEnd(startPath, 1);
                        const startParent = startTree.getNodeByPath(startParentPath);
                        const startSiblings = startParentPath.length === 0 ? startTree.treeData : startParent.children;
                        const startIndex = hp.arrayLast(startPath);
                        startSiblings.splice(startIndex, 1);
                        // remove node from the starting position may affect the target path.
                        // example
                        //  startPath   targetPath
                        //  [0]         [1]
                        //  [0]         [1, 0]
                        //  [3, 1]      [3, 3]
                        //  [3, 1]      [3, 3, 5]
                        // above targetPaths should be transformed to [0], [0, 0] [3, 2] [3, 2, 5]
                        if (startTree === targetTree) {
                            if (startPath.length <= targetPath.length) {
                                const sw = startPath.slice(0, startPath.length - 1); // without end
                                const tw = targetPath.slice(0, sw.length); // same length with sw
                                if (sw.toString() === tw.toString()) {
                                    const endIndex = sw.length;
                                    if (startPath[endIndex] < targetPath[endIndex]) {
                                        targetPath = targetPath.slice(0); // create a copy of targetPath
                                        targetPath[endIndex] -= 1;
                                    } else if (startPath[endIndex] === targetPath[endIndex]) {
                                        console.error('Draggable.afterDrop: That is impossible!');
                                    }
                                }
                            }
                        }
                    }
                    // insert to target position
                    const targetParentPath = hp.arrayWithoutEnd(targetPath, 1);
                    const targetParent = targetTree.getNodeByPath(targetParentPath);
                    let targetSiblings;
                    if (targetParentPath.length === 0) {
                        targetSiblings = targetTree.treeData;
                    } else {
                        if (!targetParent.children) {
                            // @ts-ignore
                            this.$set(targetParent, 'children', []);
                        }
                        targetSiblings = targetParent.children;
                    }
                    const targetIndex = hp.arrayLast(targetPath);
                    targetSiblings.splice(targetIndex, 0, dragNode);

                    const rollback = () => {
                        // remove inserted node from target position
                        // eslint-disable-next-line no-shadow
                        const targetParentPath = hp.arrayWithoutEnd(targetPath, 1);
                        // eslint-disable-next-line no-shadow
                        const targetParent = targetTree.getNodeByPath(targetParentPath);
                        // eslint-disable-next-line no-shadow
                        const targetSiblings = targetParentPath.length === 0 ? targetTree.treeData : targetParent.children;
                        // eslint-disable-next-line no-shadow
                        const targetIndex = hp.arrayLast(targetPath);
                        targetSiblings.splice(targetIndex, 1);

                        // add node to start position
                        const startParentPath = hp.arrayWithoutEnd(startPath, 1);
                        const startParent = startTree.getNodeByPath(startParentPath);
                        // const startSiblings = startParentPath.length === 0 ? startTree.treeData : startParent.children;
                        let startSiblings;
                        if (startParentPath.length === 0) {
                            startSiblings = startTree.treeData;
                        } else {
                            if (!startParent.children) {
                                // @ts-ignore
                                this.$set(startParent, 'children', []);
                            }
                            startSiblings = startParent.children;
                        }
                        const startIndex = hp.arrayLast(startPath);
                        startSiblings.splice(startIndex, 0, dragNode);
                    };

                    // emit event
                    startTree.$emit('input', startTree.treeData);
                    startTree.$emit('change', store);
                    targetTree.$emit('drop', store, targetPath, rollback);
                    // @ts-ignore
                    this.$root.$emit('he-tree-drop', store);
                    if (targetTree !== startTree) {
                        targetTree.$emit('input', targetTree.treeData);
                        targetTree.$emit('change', store);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    return new Promise((resolve, reject) => {
                        targetTree.$nextTick(() => {
                            resolve();
                        });
                    });
                }
            },
        };
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/camelcase,no-multi-assign
        const _makeTreeDraggable_obj = this._makeTreeDraggable_obj = makeTreeDraggable(this.$el, options);
        // watch props and update options
        ['indent',
            'triggerClass',
            'triggerBySelf',
            'unfoldWhenDragover',
            'unfoldWhenDragoverDelay',
            'draggingNodePositionMode',
            'cloneWhenDrag',
            'edgeScroll', 'edgeScrollTriggerMargin', 'edgeScrollSpeed', 'edgeScrollTriggerMode', 'edgeScrollSpecifiedContainerY', 'edgeScrollSpecifiedContainerY',
            'rtl',
            'preventTextSelection',
        ].forEach((name) => {
            // @ts-ignore
            this.$watch(name, (value) => {
                _makeTreeDraggable_obj.options[name] = value;
                _makeTreeDraggable_obj.optionsUpdated();
            });
        });
    },
    // computed: {},
    // watch: {},
    methods: {
        _Draggable_unfoldTargetNodeByEl(branchEl, store) {
            const { targetTree } = store;
            const path = targetTree.getPathByBranchEl(branchEl);
            const node = targetTree.getNodeByPath(path);
            // eslint-disable-next-line no-unused-expressions
            targetTree.unfold && targetTree.unfold(node, path);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return new Promise((resolve, reject) => {
                targetTree.$nextTick(() => {
                    resolve();
                });
            });
        },
        isNodeDraggable(node, path) {
            // @ts-ignore
            const { store } = this.treesStore;
            // @ts-ignore
            const allNodes = this.getAllNodesByPath(path);
            // @ts-ignore
            allNodes.unshift(this.rootNode);
            // eslint-disable-next-line no-restricted-syntax,no-shadow
            for (const { value: node, index } of hp.iterateAll(allNodes, { reverse: true })) {
                const currentPath = path.slice(0, (index ?? 0) + 1);
                // @ts-ignore
                const draggableOpt = node.$draggable !== undefined ? node.$draggable : this.eachDraggable;
                // @ts-ignore
                const draggable = hp.resolveValueOrGettter(draggableOpt, [currentPath, this, store]);
                if (draggable === undefined) {
                    // eslint-disable-next-line no-continue
                    continue;
                } else {
                    return draggable;
                }
            }
            return true;
        },
        isNodeDroppable(node, path) {
            // @ts-ignore
            const { store } = this.treesStore;
            // @ts-ignore
            const allNodes = this.getAllNodesByPath(path);
            // @ts-ignore
            allNodes.unshift(this.rootNode);
            let droppableFinal; let
                resolved;
            // eslint-disable-next-line no-shadow,no-restricted-syntax
            for (const { value: node, index } of hp.iterateAll(allNodes, { reverse: true })) {
                const currentPath = path.slice(0, (index ?? 0) + 1);
                // @ts-ignore
                const droppableOpt = node.$droppable !== undefined ? node.$droppable : this.eachDroppable;
                // @ts-ignore
                const droppable = hp.resolveValueOrGettter(droppableOpt, [currentPath, this, store]);
                if (droppable === undefined) {
                    // eslint-disable-next-line no-continue
                    continue;
                } else {
                    droppableFinal = droppable;
                    resolved = true;
                    break;
                }
            }
            if (!resolved) {
                droppableFinal = true;
            }
            // @ts-ignore
            if (this._internal_hook_isNodeDroppable) {
                // @ts-ignore
                return this._internal_hook_isNodeDroppable({
                    droppableFinal, node, path, store,
                });
            }
            return droppableFinal;
        },
        // override
        getPathByBranchEl(branchEl) {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const store = this.treesStore.store;
            // eslint-disable-next-line consistent-return
            const getAttrPath = (el) => {
                const pathStr = el.getAttribute('data-tree-node-path');
                if (pathStr) {
                    return pathStr.split(',').map(v => parseInt(v));
                }
            };
            const path = getAttrPath(branchEl);
            if (path) {
                return path;
            }
            // placeholder path
            let parentPath;
            // eslint-disable-next-line consistent-return
            hp.findParent(branchEl, (el) => {
                if (hp.hasClass(el, 'tree-root')) {
                    parentPath = [];
                    return true;
                }
                if (hp.hasClass(el, 'tree-branch')) {
                    parentPath = getAttrPath(el);
                    return true;
                }
                return false;
            });
            let index = 0;
            // eslint-disable-next-line no-restricted-syntax,@typescript-eslint/no-unused-vars
            for (const { value: el, index: index2 } of hp.iterateAll(branchEl.parentElement.children)) {
                if (hp.hasClass(el, 'tree-branch') || hp.hasClass(el, 'tree-placeholder')) {
                    if (el === branchEl) {
                        break;
                    }
                    index++;
                }
            }
            return [...parentPath, index];
        },
    },
} as unknown as Draggable;

</script>
