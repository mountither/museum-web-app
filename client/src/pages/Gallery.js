import React, {useEffect, useState} from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Button,
  Divider,
  Stack,
  Tag,
  Spacer,
  Image,
  Skeleton, SkeletonCircle, SkeletonText,
  Flex
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

import axios from 'axios';

import SkeletonCard from "../components/SkeletonCard";


import "@fontsource/raleway/400.css"
import "@fontsource/open-sans/700.css"

const Gallery = ()=> {

  const [artData, setArtData] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchMetObjects = async () =>{
    try {
      const res = await axios.get("https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=Iraq&q=lion&hasImage=true");
      const tempArray = [];

      for(let i=0; i < res.data.objectIDs.length; i++){
        const resEach = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${res.data.objectIDs[i]}`);
        tempArray.push(resEach.data);
      }
      setArtData(tempArray);

      setLoading(false);

    }
    catch (error) {
        console.log(error);
    }
  
  }

  console.log(artData);
  useEffect(() =>{
    setLoading(true);
    fetchMetObjects();
  }, [])

  return (
      <Box fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
         
          <VStack spacing={8}>
            <Text fontSize="5xl" fontWeight="bold">Museum</Text>
            
            {loading ? <SkeletonCard /> : artData.map((a, i) =>{
              return (
                <Box  borderWidth="0px"  borderRadius="lg" overflow="hidden" padding={5} fontWeight="semibold">

                    <Image maxHeight="100%" maxWidth="100%" src={a.primaryImageSmall}/>
                    <Divider marginBottom="10px" marginTop="10px"/>
                    <Flex>

                    {a.culture && <Tag size='md' variant="solid" variant="outline">
                        {a.culture}
                    </Tag>}

                    {a.objectDate && <Tag size='md' variant="solid" variant="outline" marginLeft="10px">
                        {a.objectDate}
                    </Tag>}

                    {a.subregion && <Tag size='md' variant="solid" variant="outline" marginLeft="10px">
                    {a.subregion}
                    </Tag>}
                    </Flex>

                </Box>
              )

            })}

          </VStack>
          <Stack align='center'>
          {/* <Button width='20vw' size="sm" onClick={fetchMetData}>Send Data</Button> */}
          </Stack>
        </Grid>
      </Box>
  );
}

export default Gallery;
