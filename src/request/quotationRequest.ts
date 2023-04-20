import { IQuotation, ITemplate } from './model';

const preUrl = 'http://localhost:3000';

export async function getAllQuotations() {
    try {
        const response = await fetch(`${preUrl}/quotations/list`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function addQuotation(quotation: IQuotation) {
    try {
        const response = await fetch(`${preUrl}/quotations/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotation)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function templateSelect(quotationName: string, selectedTemplate: ITemplate[]) {
    try {
        const response = await fetch(`${preUrl}/quotations/templateSelect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quotationName, selectedTemplate })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function deleteQuotation(quotationName: string) {
    try {
        const response = await fetch(`${preUrl}/quotations/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quotationName })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
