export const internalServerError = {
    status: 500,
    body: {
        success: false,
        message: "Internal server error."
    }
};

export const ok = {
    status: 200,
    body: {
        success: true
    }
}

export const badRequest = {
    status: 400,
    body: {
        success: false
    }
}

export function badRequestWithMessage(message: String) {
    return {
        status: 400,
        body: {
            success: false,
            message: message
        }
    }
}

export const forbidden = {
    status: 403,
    body: {
        success: false
    }
}

export function forbiddenWithMessage(message: String) {
    return {
        status: 403,
        body: {
            success: false,
            message: message
        }
    }
}