import React from 'react';
import {
  Skeleton, Stack

} from '@chakra-ui/react';
import SkeletonImage from './SkeletonImage';

const SkeletonCards = () =>{

    return (
        <Stack align='center'>
          <SkeletonImage width={{ xl: "50vw", base: "70vw"}} height="50vh"/>
          <Skeleton width={{ xl: "20vw",base: "20vw"}} height="10px"/>
          <Skeleton width={{ xl: "20vw",base: "20vw"}} height="10px" marginBottom='30px'/>
        </Stack>
    ) 
}

export default SkeletonCards;