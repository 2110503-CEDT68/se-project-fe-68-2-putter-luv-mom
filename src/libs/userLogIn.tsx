export default async function userLogIn(userEmail: string, userPassword: string) {
    const response = await fetch(
        "https://project-bn-sorawat.vercel.app/api/v1/auth/login",
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