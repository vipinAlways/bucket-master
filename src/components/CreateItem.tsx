"use client"
import { startTarget } from '@/app/actions/bucketList-action/bucketlist-action'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import React from 'react'


const CreateItem = () => {

    const {toast}= useToast()
    const createBucketList = useMutation({
        mutationKey:["create-bucket-item"],
        mutationFn:startTarget,
        onError:()=>
          toast({
            title: "Error",
            description: "Error while creating item",
            variant: "destructive",
          }),
      })
  return (
    <div>
      
    </div>
  )
}

export default CreateItem
