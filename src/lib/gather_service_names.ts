/* eslint-disable camelcase */
export const getServiceNames = (service_from_argv: string): string[] | string => {
  if (service_from_argv == null || service_from_argv == undefined || service_from_argv == '') {
    return 'all';
  }
  // eslint-disable-next-line quotes
  const services = service_from_argv.replace('"', "").replace("'", "").split(",");
  if (services.length == 1 && services[0].toLowerCase() == 'all') {
    return 'all';
  }
  return services;
};
export default getServiceNames;
