// const preUrl = 'http://xa-dd3-joestar1:3000';
const preUrl = 'http://localhost:3000';

export async function loginUser(username: string, password: string) {
    try {
        const response = await fetch(`${preUrl}/u/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

export async function registerUser(username: string, password: string) {
    try {
        const response = await fetch(`${preUrl}/u/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

export async function findUserById() {
    try {
        const response = await fetch(`${preUrl}/u/findById`, {
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

export async function logout() {
    try {
        const response = await fetch(`${preUrl}/u/logout`, {
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

export async function getAllUserWithoutMe() {
    try {
        const response = await fetch(`${preUrl}/u/listWithoutMe`, {
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}
