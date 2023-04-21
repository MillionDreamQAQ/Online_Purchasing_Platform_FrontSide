import { IQuotation } from './model';

const preUrl = 'http://localhost:3000';

export async function addQuotation(quotation: IQuotation) {
    try {
        const response = await fetch(`${preUrl}/q/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotation),
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function templateSelect(quotationId: string, selectedTemplateKey: string[]) {
    try {
        const response = await fetch(`${preUrl}/q/setSelectedTemplate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quotationId, selectedTemplateKey })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function deleteQuotation(quotationId: string) {
    try {
        const response = await fetch(`${preUrl}/q/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quotationId }),
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function publishQuotation(quotationId: string, usersId: string[]) {
    try {
        const response = await fetch(`${preUrl}/q/publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quotationId, usersId }),
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
