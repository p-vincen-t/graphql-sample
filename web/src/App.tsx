import React, { useState, useEffect } from 'react'
import Routes from "./Routes"
import { setAcessToken } from './acesstoken'

export const App: React.FC = () => {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch('http://192.168.88.248:4000/refresh_token',
            {
                credentials: 'include',
                method: 'POST'
            }).then(res => res.json())
            .then(({ accessToken }) => {
                setAcessToken(accessToken)
                setLoading(false)
            })
    }, [])
    if (loading) return <div>loading...</div>
    return <Routes />
}