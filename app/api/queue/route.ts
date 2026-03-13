import { NextResponse, NextRequest } from "next/server";
import { singletonQueues } from "@/server/queue/queue";
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    let queueToken = request.cookies.get("queue_token")?.value;

    let errMsg = "Required cookie missing: queue_token";

    if (queueToken) {
        let room = singletonQueues.getQueueNumberContainingUuid(queueToken);

        if (room !== undefined) {
            let queue = singletonQueues.queues[room];
            let status = queue.getQueueStatus(queueToken);

            return NextResponse.json({
                success: true,
                message: "Success",
                data: {
                    room: room,
                    queueStatus: status
                }
            });
        }

        errMsg = "Not in queue";
    }

    return NextResponse.json({ success: false, message: errMsg }, { status: 404 });
}