import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { AuthSingleton } from "@/server/auth";
import { Queues } from "@/server/queue";

export async function GET(request: NextRequest) {
    const authToken: string | undefined = (await cookies()).get("auth_token")?.value;
    
    if (authToken === undefined || await AuthSingleton.isSessionAuthorized(authToken) == false)
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

    const params = request.nextUrl.searchParams;
    const resource = params.get("resource");

    if (resource == "num_people_in_queue") {
        const room = params.get("room");
        if (room === null)
            return NextResponse.json({ success: false, message: "Missing parameter: room" }, { status: 400 });

        const roomNum = parseInt(room);
        if (isNaN(roomNum) || roomNum < 0 || roomNum >= Queues.queues.length)
            return NextResponse.json({ success: false, message: "Invalid parameter: room" }, { status: 400 });

        const result = await Queues.queues[roomNum].length();

        return NextResponse.json({
            success: true,
            data: result
        });
    }

    if (resource == "num_queues") {
        return NextResponse.json({
            success: true,
            data: Queues.queues.length
        });
    }

	if (resource == "queue_length") {
		const room = params.get("room");
		if (room === null) {
			return NextResponse.json({
				success: false,
				message: "Missing parameter: room"
			}, { status: 400 });
		}

		const roomNum = parseInt(room);
		if (isNaN(roomNum) || roomNum < 0 || roomNum >= Queues.queues.length) {
			return NextResponse.json({
				success: false,
				message: "Invalid parameter: room"
			}, { status: 400 });
		}

		return NextResponse.json({
			success: true,
			data: await Queues.queues[roomNum].length()
		});
	}

    return NextResponse.json({
        success: false,
        message: "Missing or invalid parameter: resource" 
    }, { status: 400 });
}
//Hi, if you see this, you are gay -E
export async function POST(request: NextRequest) {
    const authToken: string | undefined = (await cookies()).get("auth_token")?.value;
    
    if (authToken === undefined || await AuthSingleton.isSessionAuthorized(authToken) == false)
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

    let json = undefined;

    try {
        json = await request.json();
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Bad Request' }, { status: 400 })
    }

    if (json == undefined)
        return NextResponse.json({ success: false, message: 'Please actually send some json' }, { status: 400 })

    const method = json.method;

    switch (method) {
        case "dequeue": {
            const room = json.room;

            if (room === undefined) {
                return NextResponse.json({
                    success: false,
                    message: "Missing required parameter: room" 
                }, { status: 400 });
            }

            const roomNum = parseInt(room);
            if (isNaN(roomNum) || roomNum < 0 || roomNum >= Queues.queues.length) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid room" 
                }, { status: 400 });
            }

            const result = await Queues.dequeue(roomNum);
            if (result === undefined) {
                return NextResponse.json({
                    success: false,
                    message: "Unsuccessful"
                }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                data: result
            });
        }

        case "enqueue": {
            const room = json.room

            if (room === undefined) {
                return NextResponse.json({
                    success: false,
                    message: "Missing required parameter: room" 
                }, { status: 400 });
            }

            const roomNum = parseInt(room);
            if (isNaN(roomNum) || roomNum < 0 || roomNum >= Queues.queues.length) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid room" 
                }, { status: 400 });
            }

            const result = await Queues.enqueue(roomNum);
            if (result === undefined) {
                return NextResponse.json({
                    success: false,
                    message: "Unsuccessful"
                }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                data: result
            });
        }
    }

    return NextResponse.json({
        success: false,
        message: "Missing or invalid parameter: method"
    }, { status: 400 });
}
