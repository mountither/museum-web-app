import React from 'react';
import {
  Box,
  Stack,
  Image,
  Center,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  useColorMode,
} from '@chakra-ui/react';

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
          fontSize={{ base:'15px', lg: "25px" }}
        >
          {title ? title : 'Untitled'}
        </Heading>

        <Stack  maxHeight="100%" overflow="hidden" maxWidth='100vw'>
        
        <Image _hover={{transform: 'scale(1.03)'}}  transition='transform .6s' objectFit="contain"  src={imgURL}/>
        </Stack>
        

        <Center >
            <Stack spacing={4}  direction={{ base:"column"}} align='center' >


            <Table>
              <Tbody fontSize={{ base:'10px', lg: "15px" }}>
               {dateCreation ? 
                <Tr>
                    <Td fontWeight='semibold'>Date Created</Td>
                    <Td>{dateCreation}</Td>
                  </Tr> : null
                }
                {
                region ?
                <Tr>
                  <Td fontWeight='semibold'>Region</Td>
                  <Td>{region}</Td>
                </Tr> : null
                }
                {
                  restPayload && 
                    restPayload.map((o, i) => (
                    o?.data ? 
                    <Tr key={i}>
                      <Td fontWeight='semibold'>{o.type}</Td>
                      <Td>{o.data}</Td>
                    </Tr> : null
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