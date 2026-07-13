// 物料统一出口:每个物料的 dev(编辑态)与 prod(运行态)组件分别以 Dev/Prod 后缀导出
export { Page as PageDev } from "./Page/dev"
export { Container as ContainerDev } from "./Container/dev"
export { Button as ButtonDev } from "./Button/dev"
export { Modal as ModalDev } from "./Modal/dev"
export { Table as TableDev } from "./Table/dev"
export { TableColumn as TableColumnDev } from "./TableColumn/dev"
export { Form as FormDev } from "./Form/dev"
export { FormItem as FormItemDev } from "./FormItem/dev"

export { Page as PageProd } from "./Page/prod"
export { Container as ContainerProd } from "./Container/prod"
export { Button as ButtonProd } from "./Button/prod"
export { Modal as ModalProd } from "./Modal/prod"
export { Table as TableProd } from "./Table/prod"
export { TableColumn as TableColumnProd } from "./TableColumn/prod"
export { Form as FormProd } from "./Form/prod"
export { FormItem as FormItemProd } from "./FormItem/prod"

// 拖拽 hook 及其类型
export { useItemDrop } from "./useItemDrop"
export type { ItemType } from "./useItemDrop"
