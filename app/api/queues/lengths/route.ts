import { NextResponse, NextRequest } from "next/server";
import { rooms } from "@/server/rooms.json";

export function GET(request: NextRequest): NextResponse {
    return NextResponse.json({
        success: true,
        data: rooms.length
    });
}