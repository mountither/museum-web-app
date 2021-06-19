import React from 'react';
import {
  Skeleton, Stack

} from '@chakra-ui/react';

const SkeletonIntro = () =>{

    return (
        <Stack align='center'>
          <Skeleton width='400px' height="100px" margin='20px'/>

        </Stack>
    ) 
}

export default SkeletonIntro 