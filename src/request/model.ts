export interface ITemplate {
    key: string;
    name: string;
    size: string;
    unit: string;
    desc: string;
}

export interface IQuotation {
    key: string;
    quotationName: string;
    template: ITemplate[];
    selectedTemplate: ITemplate[];
}
