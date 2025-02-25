"use client"
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getAllUser } from './actions'

const page = () => {
    const {data} = useQuery({
        queryKey:['users-data'],
        queryFn: getAllUser
    })
  return (
    <div>
        <ol className='list-decimal'>   
            {
                data && data.map((user:any) => (
                    <li key={user.id}>{user.userName}</li>
                ))
            }
        </ol>
    </div>
  )
}

export default page