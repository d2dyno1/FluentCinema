export const emailValidationRegex = /^[a-zA-Z\d]+@[a-zA-Z\d]+.[a-zA-Z\d]+$/;
export const passwordValidationRegex = /^(?=.*[A-Z])(?=.*[\d])(?=.*[^a-zA-Z\d]).{8,}$/;

export const usernameValidationRegex = /^[\w]{2,16}$/;

export function validateCredentials(email: string, password: string) {
    return emailValidationRegex.test(email) && passwordValidationRegex.test(password);
}