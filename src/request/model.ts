export interface ITemplate {
    key: string;
    name: string;
    count: number;
    price: number;
    size: string;
    unit: string;
    desc: string;
}

export interface IQuotation {
    id: string;
    key: string;
    quotationName: string;
    template: ITemplate[];
    selectedTemplate: ITemplate[];
}

export interface IUser {
    id: string;
    username: string;
}
