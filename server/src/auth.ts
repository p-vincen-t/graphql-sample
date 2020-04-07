import { User } from "./entity/User";
import { sign, verify } from 'jsonwebtoken'

export const createAccessToken = (user: User): string => {
    return sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: '15s'
    })
}

export const createRefreshToken = (user: User):string => {
    return sign(
        { userId: user.id, tokenVersion: user.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: '7d'
    })
}

export const validateAccessToken = (token: string): any => {
    return verify(token, process.env.ACCESS_TOKEN_SECRET!)
}

export const validateRefreshToken = (token: string): any => {
    return verify(token, process.env.REFRESH_TOKEN_SECRET!)
}