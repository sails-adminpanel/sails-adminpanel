import { TreeNode, SlVueTreeProps, Context } from './types';

declare const _default: <T>(__VLS_props: Awaited<typeof __VLS_setup>["props"], __VLS_ctx?: __VLS_Prettify<Pick<Awaited<typeof __VLS_setup>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_Prettify<__VLS_OmitKeepDiscriminatedUnion<(Partial<{}> & Omit<{
        "onUpdate:modelValue"?: (...args: any[]) => any;
        onSelect?: (...args: any[]) => any;
        onBeforedrop?: (...args: any[]) => any;
        onDrop?: (...args: any[]) => any;
        onToggle?: (...args: any[]) => any;
        onNodeclick?: (...args: any[]) => any;
        onNodedblclick?: (...args: any[]) => any;
        onUpdateNode?: (...args: any[]) => any;
        onNodecontextmenu?: (...args: any[]) => any;
        onExternaldragover?: (...args: any[]) => any;
        onExternaldrop?: (...args: any[]) => any;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & Readonly<import('vue').ExtractPropTypes<{}>> & {
        "onUpdate:modelValue"?: (...args: any[]) => any;
        onSelect?: (...args: any[]) => any;
        onBeforedrop?: (...args: any[]) => any;
        onDrop?: (...args: any[]) => any;
        onToggle?: (...args: any[]) => any;
        onNodeclick?: (...args: any[]) => any;
        onNodedblclick?: (...args: any[]) => any;
        onUpdateNode?: (...args: any[]) => any;
        onNodecontextmenu?: (...args: any[]) => any;
        onExternaldragover?: (...args: any[]) => any;
        onExternaldrop?: (...args: any[]) => any;
    }, never>) & SlVueTreeProps<T>, keyof import('vue').VNodeProps | keyof import('vue').AllowedComponentProps>> & {} & (import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps);
    expose(exposed: import('vue').ShallowUnwrapRef<Context<T>>): void;
    attrs: any;
    slots: ReturnType<() => {
        branch?(_: {
            node: TreeNode<T>;
        }): any;
        toggle?(_: any): any;
        title?(_: any): any;
        "empty-node"?(_: any): any;
        sidebar?(_: any): any;
        draginfo?(_: {}): any;
    }>;
    emit: (event: "update:modelValue" | "select" | "beforedrop" | "drop" | "toggle" | "nodeclick" | "nodedblclick" | "updateNode" | "nodecontextmenu" | "externaldragover" | "externaldrop", ...args: any[]) => void;
}>) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
