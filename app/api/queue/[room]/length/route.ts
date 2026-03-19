import { NextResponse, NextRequest } from "next/server";
import { clientSupabase } from "@/server/client-supabase";
import { rooms } from "@/server/rooms.json"

export async function GET(request: NextRequest, { params } : { params: Promise<{ room: string }> }) {
    const { room } = await params;
    const roomNum: number = parseInt(room);
    if (isNaN(roomNum) || roomNum < 0 || roomNum >= rooms.length) {
        return NextResponse.json({
            success: false,
            message: "Invalid parameter: room"
        }, { status: 404 });
    }

    const { count, error } = await clientSupabase
        .from("public_queues")
        .select("*", { count: "exact", head: true })
        .eq("queue", roomNum)
        .eq("served", false);
    
    if (error) {
        return NextResponse.json({
            success: false,
            message: error
        });
    }

    return NextResponse.json({
        success: true,
        data: count
    })
}