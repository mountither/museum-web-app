import React, {useEffect, useState} from 'react';
import {
  Skeleton, SkeletonText,Stack

} from '@chakra-ui/react';

const SkeletonCards = () =>{

    const [skeletons, setSkeletons] = useState([]);

    const renderSkeletonItems = ()=>{

        let SkeletonRows = [];

        for(var i=0; i< 1; i++) 
        {
            SkeletonRows.push({image: <Skeleton  width={{ xl: "50vw", base: "70vw"}} height="50vh"/>,
                                text: <Skeleton width={{ xl: "50vw",base: "70vw"}} height="10px"/>
                            })

        }
        setSkeletons(SkeletonRows);
    }

    useEffect(()=>{
        renderSkeletonItems();
    }, [])

    return (
        <Stack>
            {skeletons.map((row,i) => 
            {
                return (
                < React.Fragment key={i}>
                    {row.image}
                    {row.text}

                    <div style={{marginBottom:'30px'}}>
                        {row.text}
                    </div>
                </React.Fragment>
                )
            }
            )}
        </Stack>
    ) 
}

export default SkeletonCards;