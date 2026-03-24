export default async function getReviews(vid: string, token?: string) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const response = await fetch(
        `https://project-bn-sorawat.vercel.app/api/v1/restaurants/${vid}/reviews`,
        { headers, cache: "no-store" }
    )
    if (!response.ok) return { data: [] }
    return await response.json()
}