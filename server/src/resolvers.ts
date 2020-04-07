import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware } from 'type-graphql'
import { User } from './entity/User'
import { hash, compare } from 'bcryptjs'
import { MyContext } from './MyContext';
import { createRefreshToken, createAccessToken, validateAccessToken } from './auth';
import { isAuth } from './isAuth';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;

    @Field(() => User)
    user: User;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return 'hi!'
    }

    @Query(() => User, { nullable: true })
    me(
        @Ctx() context: MyContext
    ) {
        const authorization = context.req.headers['authorization']
        if (!authorization) return null

        try {
            const token = authorization.split(' ')[1]
            const payload = validateAccessToken(token)
            return User.findOne({ where: { id: payload.userId } })
        } catch (err) {
            console.log(err)
            return null
        }
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(
        @Ctx() { payload }: MyContext
    ) {
        return `your user id is: ${payload!.userId}`
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ) {
        try {
            const hashedPassword = await hash(password, 12)
            await User.insert({ email, password: hashedPassword })
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: MyContext
    ): Promise<LoginResponse> {
        try {
            const user = await User.findOneOrFail({ where: { email } })

            const valid = await compare(password, user.password)
            if (!valid) {
                throw Error('password mismatch')
            }

            res.cookie('jid', createRefreshToken(user), {
                httpOnly: true,
                path: '/refresh_token'
            })

            return {
                accessToken: createAccessToken(user),
                user
            }
        } catch (err) {
            console.log(err)
            throw err
        }


    }


    @Query(() => [User])
    users() {
        return User.find()
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async logout(
        @Ctx() { res }: MyContext
    ) {
        res.cookie('jid', '', {
            httpOnly: true,
            path: '/refresh_token'
        })
        return true
    }
}