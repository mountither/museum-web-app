import React from 'react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    CloseButton,
    UnorderedList, ListItem,
    useDisclosure,
    Box
} from '@chakra-ui/react';

const AlertContent = ({errors, ...boxProps}) =>{

    const { isOpen, onToggle} = useDisclosure()


    return (

        <Box {...boxProps} width={{lg:375, md: 375, base:310}} height={30} marginTop={5}  >
          <Alert 
            borderRadius={5}
            marginBottom={10}
            height={errors.length > 1 && 55}
            hidden={isOpen}
            status="warning" 
            variant='subtle'
            >
              <AlertIcon size={5}/>
              <AlertTitle fontSize={{base: 15, lg:15, md:15, sm:10}} mr={2}>API Fail</AlertTitle>
              <UnorderedList>
              {errors.map((e, i) => (
                    <ListItem key={i} fontSize={{base: 13, lg:13, sm:10, xs:10}}>{e}</ListItem>
                    )
                )}
              </UnorderedList>
              <CloseButton onClick={onToggle} position="absolute" right="8px" top="13px" width="20px" height="20px" />
          </Alert>     
        </Box>
    ) 
}

export default AlertContent;