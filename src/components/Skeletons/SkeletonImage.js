import React from 'react';
import {
  Skeleton

} from '@chakra-ui/react';

const SkeletonImage = ({...props}) =>{

    return (
        <Skeleton {...props} />
    )
}

export default SkeletonImage;