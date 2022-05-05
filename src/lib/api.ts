export function badRequest(message: String) {
    return {
        status: 400,
        body: {
            success: false,
            errorMessage: message
        }
    }
}

export const internalServerError = {
    status: 500,
    body: {
        success: false,
        errorMessage: "Internal server error."
    }
};