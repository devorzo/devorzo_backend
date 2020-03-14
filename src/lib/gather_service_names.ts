export const getServiceNames = (argv: string) => {
    if (argv == null || argv == undefined) {
        return ""
    } else {

        // eslint-disable-next-line quotes
        return argv.replace('"', "").replace("'", "").split(",")
    }
}
export default getServiceNames