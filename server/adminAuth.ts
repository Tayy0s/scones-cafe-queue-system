import crypto from "node:crypto";
import { Redis } from "@upstash/redis";

type AuthorizedUser = {
    username: string,
    passwordHash: string,
    salt: string
};

function generatePasswordHash(password: string, salt: string) : string{
    return crypto
            .createHash("sha256")
            .update(password + salt)
            .digest("hex");
}

export class AdminAuth {
    authorizedUsers : AuthorizedUser[] = [];
    authorizedSessions: string[] = [];
    redis: Redis = Redis.fromEnv();

    constructor() {
        (async () => {
            this.redis.incr("counter");
        })();
    }


    verifyLogin(username: string, password: string) : boolean {
        const user = this.authorizedUsers.find(u => u.username === username);
        if (!user) return false;

        let remotePasswordHash = generatePasswordHash(password, user.salt);
        
        return user.passwordHash === remotePasswordHash;
    }

    // horrible function name
    tryLogin(username: string, password: string) : string | undefined {
        if (this.verifyLogin(username, password)) {
            const sessionToken = Buffer.from(crypto.randomBytes(24)).toString("base64");
            this.authorizedSessions.push(sessionToken);

            return sessionToken;
        }
    }

    // probably need to rename the variables "session", "auth_token" and
    // "sessionToken" to one unified name for clarity
    isSessionAuthorized(session: string) : boolean {
        for (let i = 0; i < this.authorizedSessions.length; i++) {
            console.log(`${session} == ${this.authorizedSessions[i]}`);
        }
        return this.authorizedSessions.some(s => s == session);
    }

};

export const adminAuthSingleton = new AdminAuth();