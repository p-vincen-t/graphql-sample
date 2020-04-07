import { MiddlewareFn } from "type-graphql"
import { MyContext } from "./MyContext"
import { validateAccessToken } from "./auth"


export const isAuth: MiddlewareFn<MyContext> = ({context}, next) => {
    const authorization = context.req.headers['authorization']
    if (!authorization) throw new Error('not authenticated')

    try {
        const token = authorization.split(' ')[1]
        const payload = validateAccessToken(token)
        context.payload = payload
    }catch(err) {
        console.log(err)
        throw new Error('not authenticated')
    }
    return next()
}