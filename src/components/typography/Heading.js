import React from 'react'

import { 
    Heading as ChakraHeading, 
  } from '@chakra-ui/react';

const Heading = ({title, main = false,  ...props}) => {
    return ( 

        <ChakraHeading 
            fontSize={{lg: main ? '8xl' : '3xl', base: main ? '6xl' : 'xs'}} 
            textTransform= 'capitalize'
            {...props}
        >
            {title}
      </ChakraHeading>
     );
}
 
export default Heading;