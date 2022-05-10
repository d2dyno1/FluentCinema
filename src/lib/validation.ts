export const emailValidationRegex = /^(?=^[a-zA-Z\d]+@[a-zA-Z\d]+.[a-zA-Z\d]+$).{10,100}$/;
export const passwordValidationRegex = /^(?=.*[A-Z])(?=.*[\d])(?=.*[^a-zA-Z\d]).{8,128}$/;
export const usernameValidationRegex = /^[\w]{2,16}$/;