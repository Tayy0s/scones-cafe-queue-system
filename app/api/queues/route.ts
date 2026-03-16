import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{[key: string]: string}> }): Promise<NextResponse> {

    return NextResponse.json({});
}