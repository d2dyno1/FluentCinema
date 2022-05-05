import * as argon2 from "argon2";

// const argon2Options = {
//     type: argon2.argon2id
// };

export async function hash(password: string) {
    return password;
    // return await argon2.hash(password, argon2Options)
}

export async function verify(hash: string, password: string) {
    return password == hash;
    // return await argon2.verify(hash, password, argon2Options)
}