const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default async function userLogIn(userEmail: string, userPassword: string) {
    const response = await fetch(
        `${API_URL}/api/v1/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to log in");
    }

    const json = await response.json();
    return {
        ...json.data,
        token: json.token,
    }
}