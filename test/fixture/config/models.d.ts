export namespace models {
    let migrate: string;
    namespace attributes {
        namespace id {
            let type: string;
            let autoIncrement: boolean;
        }
        namespace createdAt {
            let type_1: string;
            export { type_1 as type };
            export let autoCreatedAt: boolean;
        }
        namespace updatedAt {
            let type_2: string;
            export { type_2 as type };
            export let autoUpdatedAt: boolean;
        }
    }
}
