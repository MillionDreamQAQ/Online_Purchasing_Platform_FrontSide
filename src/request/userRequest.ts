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
        console.error('Error logging in user:', error);
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
        console.error('Error registering user:', error);
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
        console.error('Error finding user by id:', error);
    }
}