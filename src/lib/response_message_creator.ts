export const responseMessageCreator = (message: any = "message", success: boolean | number = true) => {
    let data

    if (success == true || success == 1) {
        data = {
            success: true,
            message
        }
    } else {
        data = {
            success: false,
            error: { message }
        }
    }

    return data
}