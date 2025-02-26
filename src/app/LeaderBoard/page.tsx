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
    <div className='p-4'>
        <ol className='list-decimal group'>   
            {
                data && data.map((user:User) => (
                    <li key={user.id} className='details w-96 h-52' >
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