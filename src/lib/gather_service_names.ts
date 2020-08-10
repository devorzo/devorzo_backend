export const getServiceNames = (service_from_argv: string) => {
    if (service_from_argv == null || service_from_argv == undefined || service_from_argv == "") {
        return "all"
    } else {
        // eslint-disable-next-line quotes
        let services = service_from_argv.replace('"', "").replace("'", "").split(",")
        if(services.length == 1 && services[0].toLowerCase() == "all"){
            return "all"
        }else{
            return services
        }
    }
}
export default getServiceNames