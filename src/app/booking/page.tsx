import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import BookingClient from "@/components/BookingClient";
import getVenues from "@/libs/getVenues";

export default async function BookingPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/signin")
    }

    const venuesData = await getVenues().catch(() => ({ data: [] }))
    const restaurants = venuesData.data ?? []

    return (
        <Suspense>
            <BookingClient restaurants={restaurants} />
        </Suspense>
    )
}