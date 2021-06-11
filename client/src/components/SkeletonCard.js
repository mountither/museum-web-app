import React, {useEffect, useState} from 'react';
import {
  Skeleton, SkeletonText,Stack

} from '@chakra-ui/react';

const skeletonCount = 4;

const SkeletonCard = () =>{

    const renderSkeletons = ()=>{

        let SkeletonRows = [];

        for(var i=0; i< 4; i++) 
        {
            SkeletonRows.push(
            <React.Fragment key={i}>
                <Skeleton width={{ xl: "50vw", sm: "70vw"}} height="50vh"/>
                <SkeletonText mt="10" width={{ xl: "50vw", sm: "70vw"}} noOfLines={2} />
            </React.Fragment>
            )
        }
        return SkeletonRows;
    }

    return (
        <Stack>
            {renderSkeletons().map(row => row)}
        </Stack>
    ) 
}

export default SkeletonCard;