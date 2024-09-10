export class FileUploader {
    constructor(config: any);
    type: any;
    elName: any;
    url: any;
    acceptedFiles: any;
    dataInput: any;
    small: any;
    large: any;
    field: any;
    filesize: any;
    resize: any;
    aspect: any;
    files: any[];
    el: any;
    selectedFile: any;
    dataPreview: any;
    size: any;
    progressDiv: string;
    container: any;
    fileContainer: string;
    previewName: string;
    addFile(file: any): void;
    setModalFile(): void;
    setListeners(): void;
    saveData(): void;
    loadData(): void;
}
