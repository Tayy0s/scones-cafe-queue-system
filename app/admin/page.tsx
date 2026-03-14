import AdminClientPage from "./ClientPage";
import { adminAuthSingleton } from "@/server/adminAuth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { singletonQueues } from "@/server/queue"

export default async function AdminPage() {
	let lengths = await Promise.all(singletonQueues.queues.map(q => q.length()));
    return (
        <>
            <AdminClientPage
				numRooms={singletonQueues.queues.length}
				initialQueueLengths={lengths}
			/>
        </>
    );
}
