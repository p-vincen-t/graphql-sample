import "reflect-metadata";
import "dotenv/config"
import { createConnection } from "typeorm";
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { UserResolver } from "./resolvers";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { validateRefreshToken, createAccessToken } from "./auth";
import { User } from "./entity/User";
import cors from 'cors'

(async () => {

    const app = express()
    app.use(cors({
        credentials: true,
        origin: 'http://192.168.88.248:3000'
    }))

    app.use(cookieParser())

    app.get('/', (_, res) => {
        res.send('hello')
    });

    await createConnection()

    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid
        if(!token) return res.send({ ok: false, accessToken: ''})
        let payload = null
        try {
            payload = await validateRefreshToken(token)
            const user: User = await User.findOneOrFail({where: {id: payload.userId}})
            return res.send({ok: true, accessToken: createAccessToken(user)}) 
        } catch(err) {
            console.log(err)
            return res.send({ ok: false, accessToken: ''})
        }
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                UserResolver
            ]
        }),
        context: ({req, res}) => ({req, res})
        
    })

    apolloServer.applyMiddleware({app, cors: false})

    app.listen(4000, () => {
        console.log('server started')
    })
})()

