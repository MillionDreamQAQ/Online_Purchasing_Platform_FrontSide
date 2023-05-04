export interface ITemplate {
    key: string;
    name: string;
    count: number;
    price: number;
    size: string;
    unit: string;
    desc: string;
}

export interface IReceivedQuotation {
    id: string;
    key: string;
    finishedLocked: boolean;
    receiver: IUser;
    publisher: IUser;
    quotation: IQuotation;
}

export interface IFinishedQuotation {
    id: string;
    key: string;
    receiver: IUser;
    publisher: IUser;
    quotation: IQuotation;
}

export interface IQuotation {
    id: string;
    key: string;
    quotationName: string;
    publishedLocked: boolean;
    template: ITemplate[];
    selectedTemplate: ITemplate[];
}

export interface IUser {
    id: string;
    username: string;
}
