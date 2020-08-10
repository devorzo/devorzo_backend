// eslint-disable-next-line no-unused-vars
import * as express from "express"
// export interface Request extends Request {

// }

// export interface Response extends Response{

// }


declare global {
    namespace Express {
        interface Request {
            user: any
            token: string | undefined | null
        }
    }
}


