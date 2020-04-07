import React from 'react'
import { Link } from 'react-router-dom'
import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import { setAcessToken } from '../acesstoken'
export const Header: React.FC = () => {
    const { data } = useMeQuery()
    const [logout, { client }] = useLogoutMutation()

    return (
        <header>
            <div>
                <Link to="/" >home</Link>
            </div>
            <div>
                <Link to="/register" >regiser</Link>
            </div>
            <div>
                <Link to="/login" >login</Link>
            </div>
            <div>
                <Link to="/bye" >bye</Link>
            </div>

            {data && data.me ? (
                <div>
                    <div>
                        <button onClick={async () => {
                            await logout()
                            setAcessToken('')
                            await client?.resetStore()
                        }}>logout</button>
                    </div>
                    <div>you are logged in as : {data.me.email}</div>
                </div>
            ) : (<div>not logged in</div>)}
        </header>
    )
}