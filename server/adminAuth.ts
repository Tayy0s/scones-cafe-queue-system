import crypto from "node:crypto";
import { Redis } from "@upstash/redis";

type AuthorizedUser = {
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
    authorizedUsers: AuthorizedUser[] = [];
    authorizedSessions: string[] = [];
    redis: Redis = Redis.fromEnv();
    redisPrefix: string;

    constructor(redisPrefix: string = "") {
        this.redisPrefix = redisPrefix;

        if (redisPrefix !== "") this.redisPrefix += "_"
    }


    async verifyLogin(username: string, password: string) : Promise<boolean> {
        const user: AuthorizedUser | null = await this.redis.hget(this.redisPrefix + "users", "username");
        if (user === null) return false;

        let remotePasswordHash = generatePasswordHash(password, user.salt);
        
        return user.passwordHash === remotePasswordHash;
    }

    // horrible function name
    async tryLogin(username: string, password: string) : Promise<string | undefined> {
        if (await this.verifyLogin(username, password)) {
            const sessionToken = Buffer.from(crypto.randomBytes(24)).toString("base64");
            await this.redis.sadd(this.redisPrefix + "sessions", sessionToken);

            return sessionToken;
        }
    }

    // probably need to rename the variables "session", "auth_token" and
    // "sessionToken" to one unified name for clarity
    async isSessionAuthorized(session: string) : Promise<boolean> {
        return await this.redis.sismember(this.redisPrefix + "sessions", session) == 1
    }

};

export const adminAuthSingleton = new AdminAuth();