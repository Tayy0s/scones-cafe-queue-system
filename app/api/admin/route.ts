import { NextResponse, NextRequest } from "next/server";
import { redirect, RedirectType } from 'next/navigation'
import { cookies } from 'next/headers';
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
    let token: string | undefined = (await cookies()).get("token")?.value;
    
    let ADMIN_PASSWORD: string;

    try {
        ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
        if (
            ADMIN_PASSWORD === "" ||
            ADMIN_PASSWORD === null ||
            ADMIN_PASSWORD === undefined 
        ) {
            return new NextResponse(JSON.stringify(
                { message: 'Internal Server Error' }), {    
                status: 500,
                headers: { 'content-type': 'application/json' },
            });
        }
            
    } catch (err) {
        console.log(err);
        return new NextResponse(JSON.stringify(
            { message: 'Internal Server Error' }), {
            status: 502,
            headers: { 'content-type': 'application/json' },
        });
    }

    const hash = crypto.createHash("sha256");
    hash.update(ADMIN_PASSWORD);
    const hashStr: string = hash.digest('hex');

    if (token === hashStr) {
        // TODO: Add admin queue code

    } else {
        return new NextResponse(JSON.stringify(
            { message: 'Invalid Credentials' }), {
            status: 502,
            headers: { 'content-type': 'application/json' },
        });
    }
}