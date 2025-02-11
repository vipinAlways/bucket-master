"use client"
import { trackRecord } from '@/app/actions/bucketList-action/bucketlist-action';
import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react'

const page = ({params}:{params:Promise<{trackFor:string}>}) => {
    const {trackFor}= use(params)
    const { data, isPending } = useQuery({
        queryKey: ["track-record"],
        queryFn: trackRecord,
      });

    const pageData = [
        {
            for:"holdData",
            taskData:data?.holdTartget
        },
        {
            for:"AcheiveData", 
            taskData:data?.achievedTartget
        },
        {
            for:"failData",
            taskData:data?.failedTartget
        },
    ]
  return (
    <div>
        {
            pageData.map((items,index)=>{
                if (items.for === trackFor) {
                    return items.taskData?.map((itemData,index2)=>(
                        <div key={index+index2} className=''>
                        {
                            
                        }
                    </div>
                    ))
                }
            })
        }
    </div>
  )
}

export default page