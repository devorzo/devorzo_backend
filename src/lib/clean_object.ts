export const cleanObject = (obj: any) => {
    // var propNames = Object.getOwnPropertyNames(obj);
    // for (var i = 0; i < propNames.length; i++) {
    //     var propName = propNames[i];
    //     if (obj[propName] === null || obj[propName] === undefined) {
    //         delete obj[propName];
    //     }
    // }

    const newObj: any = {};

    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === "object") {
            newObj[key] = cleanObject(obj[key]); // recurse
        } else if (obj[key] != null) {
            newObj[key] = obj[key]; // copy value
        }
    });

    return newObj;
}