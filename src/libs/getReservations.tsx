const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default async function getReservations(token: string) {
    const response = await fetch(
        `${API_URL}/api/v1/reservations`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    )
    if (!response.ok) {
        throw new Error("Failed to fetch reservations")
    }
    return await response.json()
}