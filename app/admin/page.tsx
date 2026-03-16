import AdminClientPage from "./ClientPage";
import { Queues } from "@/server/queue"
import Footer from "@/components/Footer";

export default async function AdminPage() {
	let lengths = await Promise.all(Queues.queues.map(q => q.length()));
    return (
        <div className="flex flex-col min-h-screen min-w-80 justify-between">        
            <AdminClientPage
				numRooms={Queues.queues.length}
				initialQueueLengths={lengths}
			/>
            <Footer />
        </div>
    );
}
