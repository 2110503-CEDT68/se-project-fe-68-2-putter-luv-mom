import Banner from '../components/Banner';
import VenuePage from './(venueinfo)/venue/page';
import RecommendedSection from '@/components/RecommendedSection';

export default function Home() {
    return (
        <main className="min-h-screen w-full bg-black">
            <Banner />
            <RecommendedSection />
            <VenuePage />
        </main>
    );
}