import React from 'react'

import { 
    Heading as ChakraHeading, 
  } from '@chakra-ui/react';

const Heading = ({title, main = false,  ...props}) => {
    return ( 

        <ChakraHeading 
            fontSize={{lg: main ? '7xl' : '3xl', base: main ? '5xl' : 'xs'}} 
            textTransform= 'capitalize'
            {...props}
        >
            {title}
      </ChakraHeading>
     );
}
 
export default Heading;