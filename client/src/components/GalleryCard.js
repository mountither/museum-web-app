import React, {useEffect, useState} from 'react';
import {
    Box,
    Divider,
    Stack,
    Tag,
    TagLabel,
    TagLeftIcon,
    Image,
    Center,
    Heading,
    Stat,
    StatHelpText,
    StatLabel,
    Icon,
    Code ,
    Table,
  Tbody,
  Tr,
  Td,
  useColorMode,

} from '@chakra-ui/react';
import {  RiMapPinTimeLine} from "react-icons/ri";

// params: the content to be shown on card.
// reqs: image, date
// others are props


const GalleryCard = ({title, imgURL, dateCreation, region,  restPayload}) =>{


    const { colorMode } = useColorMode()

    return (

    <Box boxShadow={colorMode === 'dark' ? 'lg' :'sm'} borderRadius="md" maxW="70rem" overflow="hidden" padding={5} >
        <Heading 
          mb={4} 
          size='sm'
        >
          {title ? title : 'Untitled'}
        </Heading>

        <Stack  maxHeight="100%" overflow="hidden" maxWidth='100vw'>
        
        <Image _hover={{transform: 'scale(1.1)'}}  transition='transform .6s' objectFit="contain"  src={imgURL}/>
        </Stack>
        

        <Center >
            <Stack spacing={4}  direction={{ base:"column"}} align='center' >


            <Table>
              <Tbody fontSize={{ base:'10px', lg: "15px" }}>
               {dateCreation && 
                <Tr>
                    <Td fontWeight='semibold'>Date Created</Td>
                    <Td>{dateCreation}</Td>
                  </Tr>
                }
                {
                region && 
                <Tr>
                  <Td fontWeight='semibold'>Region</Td>
                  <Td>{region}</Td>
                </Tr>
                }
                {
                  restPayload && 
                    restPayload.map((o, i) => (
                    o && 
                    <Tr key={i}>
                      <Td fontWeight='semibold'>{o.type}</Td>
                      <Td>{o.data}</Td>
                    </Tr>
                    ))
              }
              </Tbody>
          
            </Table>

        
            </Stack>
        </Center>

  </Box>
    ) 
}

export default GalleryCard;