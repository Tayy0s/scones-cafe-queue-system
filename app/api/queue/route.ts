import { NextResponse, NextRequest } from "next/server";
import { Queues } from "@/server/queue";

export async function GET(request: NextRequest) {
    let queueToken = request.nextUrl.searchParams.get("queue_token") ?? undefined;
    
    if (queueToken === undefined)
        queueToken = request.cookies.get("queue_token")?.value;

    let errMsg = "Required value missing: queue_token";

    if (queueToken) {
        let room = await Queues.getQueueNumberContainingUuid(queueToken);

        if (room !== undefined) {
            let queue = Queues.queues[room];
            let status = await queue.getQueueStatus(queueToken);

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