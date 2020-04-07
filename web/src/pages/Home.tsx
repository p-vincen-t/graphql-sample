import React from 'react'
import { useUsersQuery } from '../generated/graphql'
export const Home: React.FC = () => {

    const {data} = useUsersQuery({fetchPolicy: 'network-only'})
    if (!data) return (<div>loading users...</div>)
    return (<div>
        <div>users:</div>
        <ul>
            {data.users.map(x => {
                return <li key={x.id}>{x.email}, </li>
            })}
        </ul>
    </div>)
}