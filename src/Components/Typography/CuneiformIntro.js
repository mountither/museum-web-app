import React from 'react'
import { 
    Text, 
  } from '@chakra-ui/react';
const CuneiformIntro = ({title, ...props}) => {
    return (  

        <Text 
            fontSize="80px" 
            _hover={{color:'white'}} 
            style={{MozUserSelect: 'none', userSelect:'none', WebkitUserSelect:'none'}}
            {...props}
        >
            {title}
        </Text>

    );
}
 
export default CuneiformIntro;