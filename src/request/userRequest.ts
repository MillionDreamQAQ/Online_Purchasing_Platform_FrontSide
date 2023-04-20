const preUrl = 'http://localhost:3000';

export async function loginUser(username: string, password: string) {
    try {
        const response = await fetch(`${preUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error logging in user:', error);
    }
}

export async function registerUser(username: string, password: string) {
    try {
        const response = await fetch(`${preUrl}/users/register`, {
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
