export namespace adminpanel {
    export namespace translation {
        let locales: string[];
        let path: string;
        let defaultLocale: string;
    }
    export namespace forms {
        let path_1: string;
        export { path_1 as path };
        export namespace data {
            namespace example {
                namespace label {
                    let title: string;
                    let type: string;
                    let value: string;
                    let required: boolean;
                    let tooltip: string;
                    let description: string;
                }
            }
        }
    }
    export namespace navigation {
        let items: {
            title: string;
            model: string;
            urlPath: string;
        }[];
        let sections: string[];
        let groupField: {
            name: string;
            required: boolean;
        }[];
        let movingGroupsRootOnly: boolean;
    }
    export { models };
}
declare namespace models {
    namespace test {
        let title_1: string;
        export { title_1 as title };
        export let model: string;
        export let tools: ({
            link: string;
            title: string;
            icon: string;
            accessRightsToken?: undefined;
        } | {
            link: string;
            title: string;
            icon: string;
            accessRightsToken: string;
        })[];
        export namespace fields {
            export namespace title_2 {
                let title_3: string;
                export { title_3 as title };
                let tooltip_1: string;
                export { tooltip_1 as tooltip };
            }
            export { title_2 as title };
            export namespace title_2_1 {
                let title_4: string;
                export { title_4 as title };
                let type_1: string;
                export { type_1 as type };
            }
            export { title_2_1 as title_2 };
            export namespace test_ck5_1 {
                let type_2: string;
                export { type_2 as type };
                let tooltip_2: string;
                export { tooltip_2 as tooltip };
                let title_5: string;
                export { title_5 as title };
                export namespace options {
                    let ckeditor5: boolean;
                    let removePlugins: string[];
                    namespace toolbar {
                        let items_1: string[];
                        export { items_1 as items };
                    }
                    namespace image {
                        let toolbar_1: string[];
                        export { toolbar_1 as toolbar };
                    }
                    namespace table {
                        let contentToolbar: string[];
                    }
                }
            }
            export namespace sort {
                let type_3: string;
                export { type_3 as type };
                let title_6: string;
                export { title_6 as title };
            }
            export namespace sort_test {
                let type_4: string;
                export { type_4 as type };
                let title_7: string;
                export { title_7 as title };
            }
            export namespace image_1 {
                let type_5: string;
                export { type_5 as type };
                let title_8: string;
                export { title_8 as title };
                export namespace options_1 {
                    let accepted: string[];
                    let filesize: number;
                }
                export { options_1 as options };
            }
            export { image_1 as image };
            export namespace gallery {
                let type_6: string;
                export { type_6 as type };
                let title_9: string;
                export { title_9 as title };
                export namespace options_2 {
                    let accepted_1: string[];
                    export { accepted_1 as accepted };
                    let filesize_1: number;
                    export { filesize_1 as filesize };
                }
                export { options_2 as options };
            }
            export namespace file {
                let type_7: string;
                export { type_7 as type };
                export namespace options_3 {
                    let filesize_2: number;
                    export { filesize_2 as filesize };
                    let accepted_2: string[];
                    export { accepted_2 as accepted };
                }
                export { options_3 as options };
            }
            export namespace range {
                let type_8: string;
                export { type_8 as type };
                export namespace options_4 {
                    let min: number;
                    let max: number;
                }
                export { options_4 as options };
            }
            export namespace json {
                let type_9: string;
                export { type_9 as type };
            }
            export namespace ace {
                let type_10: string;
                export { type_10 as type };
            }
            export namespace datatable {
                let title_10: string;
                export { title_10 as title };
                let type_11: string;
                export { type_11 as type };
                export namespace options_5 {
                    namespace dataSchema {
                        let name: any;
                        let footage: any;
                        let price: any;
                    }
                    let colHeaders: string[];
                    let rowHeaders: boolean;
                    let columns: {
                        data: string;
                    }[];
                    let height: string;
                    let width: string;
                    let manualColumnResize: boolean;
                    let contextMenu: boolean;
                    let language: string;
                    let licenseKey: string;
                }
                export { options_5 as options };
            }
            export namespace geojson {
                let type_12: string;
                export { type_12 as type };
            }
            export namespace examples {
                function displayModifier(data: any): any;
            }
            export namespace select {
                let isIn: string[];
            }
            export namespace date {
                let title_11: string;
                export { title_11 as title };
                let type_13: string;
                export { type_13 as type };
            }
            export namespace datetime {
                let title_12: string;
                export { title_12 as title };
                let type_14: string;
                export { type_14 as type };
            }
            export namespace time {
                let title_13: string;
                export { title_13 as title };
                let type_15: string;
                export { type_15 as type };
            }
            export namespace number {
                let title_14: string;
                export { title_14 as title };
                let type_16: string;
                export { type_16 as type };
            }
            export namespace color {
                let title_15: string;
                export { title_15 as title };
                let type_17: string;
                export { type_17 as type };
            }
            export namespace week {
                let type_18: string;
                export { type_18 as type };
            }
            export namespace schedule {
                let title_16: string;
                export { title_16 as title };
                let type_19: string;
                export { type_19 as type };
                export namespace options_6 {
                    namespace propertyList {
                        export namespace title_17 {
                            let type_20: string;
                            export { type_20 as type };
                            let title_18: string;
                            export { title_18 as title };
                            let description_1: string;
                            export { description_1 as description };
                            let required_1: string;
                            export { required_1 as required };
                        }
                        export { title_17 as title };
                        export namespace checkmark {
                            let type_21: string;
                            export { type_21 as type };
                            let title_19: string;
                            export { title_19 as title };
                            let description_2: string;
                            export { description_2 as description };
                        }
                        export namespace hint {
                            let type_22: string;
                            export { type_22 as type };
                            let title_20: string;
                            export { title_20 as title };
                            let description_3: string;
                            export { description_3 as description };
                        }
                        export namespace link {
                            let type_23: string;
                            export { type_23 as type };
                            let title_21: string;
                            export { title_21 as title };
                            let description_4: string;
                            export { description_4 as description };
                        }
                        export namespace age {
                            let type_24: string;
                            export { type_24 as type };
                            let title_22: string;
                            export { title_22 as title };
                            let description_5: string;
                            export { description_5 as description };
                        }
                    }
                    namespace permutations {
                        let time_1: boolean;
                        export { time_1 as time };
                        let date_1: boolean;
                        export { date_1 as date };
                        let _break: boolean;
                        export { _break as break };
                        let options_7: boolean;
                        export { options_7 as options };
                    }
                }
                export { options_6 as options };
            }
            export let createdAt: boolean;
            export let updatedAt: boolean;
        }
        export namespace add {
            let fields_1: {};
            export { fields_1 as fields };
        }
        export namespace edit {
            let fields_2: {};
            export { fields_2 as fields };
        }
        export namespace list {
            let fields_3: {};
            export { fields_3 as fields };
            export namespace actions {
                let global: {
                    link: string;
                    title: string;
                    icon: string;
                }[];
                let inline: {
                    link: string;
                    title: string;
                    icon: string;
                }[];
            }
        }
        export let icon: string;
    }
    namespace category {
        let title_23: string;
        export { title_23 as title };
        let model_1: string;
        export { model_1 as model };
        let icon_1: string;
        export { icon_1 as icon };
    }
    namespace page {
        let title_24: string;
        export { title_24 as title };
        let model_2: string;
        export { model_2 as model };
        export namespace fields_4 {
            let createdAt_1: boolean;
            export { createdAt_1 as createdAt };
            let updatedAt_1: boolean;
            export { updatedAt_1 as updatedAt };
            export namespace slug {
                let title_25: string;
                export { title_25 as title };
                let type_25: string;
                export { type_25 as type };
                let required_2: boolean;
                export { required_2 as required };
            }
            export namespace title_26 {
                let title_27: string;
                export { title_27 as title };
                let type_26: string;
                export { type_26 as type };
                let required_3: boolean;
                export { required_3 as required };
            }
            export { title_26 as title };
            export namespace text {
                let title_28: string;
                export { title_28 as title };
                let type_27: string;
                export { type_27 as type };
                export namespace options_8 {
                    let ckeditor5_1: boolean;
                    export { ckeditor5_1 as ckeditor5 };
                }
                export { options_8 as options };
            }
            export namespace about {
                let type_28: string;
                export { type_28 as type };
            }
            export namespace gallery_1 {
                let type_29: string;
                export { type_29 as type };
                export namespace options_9 {
                    let accepted_3: string[];
                    export { accepted_3 as accepted };
                    let filesize_3: number;
                    export { filesize_3 as filesize };
                }
                export { options_9 as options };
            }
            export { gallery_1 as gallery };
        }
        export { fields_4 as fields };
        let icon_2: string;
        export { icon_2 as icon };
    }
}
export {};
