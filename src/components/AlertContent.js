import React, {useEffect, useState} from 'react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    UnorderedList, ListItem,
    useDisclosure,
    Box
} from '@chakra-ui/react';

const AlertContent = ({errors}) =>{

    const { isOpen, onToggle} = useDisclosure()


    return (

        <Box zIndex={10} gridArea={'2/2/3/3'} width={{lg:375, md: 375, base:310}} height={30} marginTop={5}  >

        {
          errors.length > 0 && 
       
            <Alert 
              borderRadius={5}
              marginBottom={10}
              height={errors.length > 1 && 55}
              hidden={isOpen}
              status="warning" 
              variant='subtle'
              >
                <AlertIcon size={5}/>
                <AlertTitle fontSize={{base: 15, lg:15, md:15, sm:10, xs:10}} mr={2}>API Fail</AlertTitle>
                <UnorderedList>
               {errors.map((msg, i) => {
                  return(
                      <ListItem fontSize={{base: 13, lg:13, md:13, sm:10, xs:10}}>{msg}</ListItem>
                      )
                      // <AlertDescription fontSize={{base: 15, lg:15, md:15, sm:10, xs:10}}>{msg}</AlertDescription>
                    }
                    )}
                </UnorderedList>
                <CloseButton onClick={onToggle} position="absolute" right="8px" top="13px" width="20px" height="20px" />
            </Alert>
        }
     
        </Box>
    ) 
}

export default AlertContent;