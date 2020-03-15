// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express"
export interface RequestInterface extends Request {
    user: string | undefined | null
    token: string | undefined | null
}

export interface ResponseInterface extends Response{

}