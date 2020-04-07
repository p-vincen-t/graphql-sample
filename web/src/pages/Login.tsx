import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql'
import { setAcessToken } from '../acesstoken'

export const Login: React.FC<RouteComponentProps> = ({ history }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [login] = useLoginMutation()

    return (
        <form onSubmit={async e => {
            e.preventDefault()
            const response = await login({
                variables: {
                    email, password
                },
                update: (store, { data }) => {
                    if (!data) return null
                    store.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            __typename: "Query",
                            me: data.login.user
                        }
                    })
                }
            })
            if (response && response.data) {
                setAcessToken(response.data.login.accessToken)
            }
            console.log(response)
            history.push('/')
        }}>
            <div>
                <input value={email}
                    placeholder="email"
                    onChange={e => {
                        setEmail(e.target.value)
                    }}></input>
            </div>
            <div>
                <input value={password}
                    type='password'
                    placeholder="password"
                    onChange={e => {
                        setPassword(e.target.value)
                    }}></input>
            </div>
            <button type='submit'>login</button>
        </form>
    );
}