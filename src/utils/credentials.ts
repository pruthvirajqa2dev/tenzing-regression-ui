import { decryptPassword } from "./encryptor";
import ENV from "../config/env";

export function getCredentials(
    user: string,
): [string, string] {
    const username =
        user;
    const encryptedPassword = ENV.PASSWORD;

    if (!username || !encryptedPassword) {
        throw new Error(`Missing credentials for ${user}`);
    }

    const password = decryptPassword(encryptedPassword);
    return [username, password];
}