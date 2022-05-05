export const internalServerError = {
    status: 500,
    body: {
        success: false,
        errorMessage: "Internal server error."
    }
};

export const ok = {
    status: 200,
    body: {
        success: true
    }
}

export function badRequest(message: String) {
    return {
        status: 400,
        body: {
            success: false,
            errorMessage: message
        }
    }
}

export function forbidden(message: String) {
    return {
        status: 403,
        body: {
            success: false,
            errorMessage: message
        }
    }
}