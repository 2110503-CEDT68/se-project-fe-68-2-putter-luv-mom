const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default async function deleteReservation(
    reservationId: string,
    token: string
) {
    const response = await fetch(
        `${API_URL}/api/v1/reservations/${reservationId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    if (!response.ok) {
        throw new Error("Failed to delete reservation")
    }
    return await response.json()
}