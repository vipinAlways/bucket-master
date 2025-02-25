"use client"
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getAllUser } from './actions'
import { User } from '@prisma/client'

const page = () => {
    const {data} = useQuery({
        queryKey:['all-users-data'],
        queryFn: getAllUser
    })
  return (
    <div>
        <ol className='list-decimal group'>   
            {
                data && data.map((user:User) => (
                    <li key={user.id} className='details' >
                        <div>{user.userName}</div>
                        <div>{user.streak}</div>
                    </li>
                ))
            }
        </ol>
    </div>
  )
}

export default page