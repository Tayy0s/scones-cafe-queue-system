import AdminClientPage from "./ClientPage";
import Footer from "@/components/Footer";

export default async function AdminPage() {
    return (
        <div className="flex flex-col min-h-screen min-w-80 justify-between">        
            <AdminClientPage/>
            <Footer />
        </div>
    );
}
