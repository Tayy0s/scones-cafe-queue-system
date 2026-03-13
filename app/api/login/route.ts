import { NextResponse, NextRequest } from "next/server";
import { redirect, RedirectType } from 'next/navigation'
import { cookies } from 'next/headers';
import { adminAuthSingleton } from "@/server/adminAuth";

import crypto from 'node:crypto';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();  
    const password = formData.get('password')?.toString();  

    if (username === undefined || password === undefined)
        return NextResponse.json({ success: false, messsage: "Bad Request" }, { status: 400 })

    const authToken = adminAuthSingleton.tryLogin(username, password);
    if (authToken !== undefined) {
        console.log(adminAuthSingleton.authorizedSessions);
        (await cookies()).set("auth_token", authToken);
        redirect("/admin", RedirectType.replace);
    } else {
        // redirect("/login", RedirectType.replace);
        return NextResponse.json({ message: 'Invalid Credentials' }, { status: 403 });
    }
}