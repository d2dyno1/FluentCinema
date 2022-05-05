export class User {
    public readonly id: number;
    public readonly email: string;
    public readonly hashed_password: string;


    constructor(id: number, email: string, hashed_password: string) {
        this.id = id;
        this.email = email;
        this.hashed_password = hashed_password;
    }
}