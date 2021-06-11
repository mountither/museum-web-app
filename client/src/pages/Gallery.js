import React, {useEffect, useState} from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  theme,
  Button,
  Divider,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Spacer,
  Image,
  Center,
  Spinner,
  useColorMode,
  Heading,
  Skeleton, SkeletonCircle, SkeletonText,
  Flex
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

import axios from 'axios';

import SkeletonCards from "../components/SkeletonCards";

import {  RiMapPinTimeLine} from "react-icons/ri";



import "@fontsource/raleway/400.css"
import "@fontsource/open-sans/700.css"

const Gallery = ()=> { 

  const [metArtData, setMetArtData] = useState([]);
  const [vamArtData, setVamArtData] = useState([]);
  const [hamArtData, setHamArtData] = useState([]);

  const [loading, setLoading] = useState(true);

  const { colorMode } = useColorMode()
  
  const fetchVAMObject = async()=>{
    try {
      setLoading(true);



      //const resSMITH = await axios.get(`https://www.brooklynmuseum.org/api/v2/tags/Mesopotamia`);
      
      // console.log(resSMITH.data.response.rows);


      // console.log(resSMITH.data.records);


      setLoading(false);

    }
    catch (error) {
        console.log(error);
    }
  
  }

  const fetchMuseumObjects = async () =>{
    try {
      // testing potentail parameters
      //const params = {query:'Achaemenid', start: -600, end: -330};
      const params = {query: 'Seleucid', start: -331, end: -140};
      //const params = {query: 'Mesopotamia', start: -331, end: -140};
      //const params = {query: 'Iraq', start: -331, end: -140};
      

      setLoading(true);
      // fecth from met
      //const resMET = await axios.get("https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=Iraq&q=fgfhdood&hasImage=true");
      const resMET = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${params.query}&hasImage=true`);
      
      const tempArray = [];
      const resMETCount = resMET.data.total > 10 ? 10 : resMET.data.total;

      for(let i=0; i < resMETCount; i++){
        const resEach = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${resMET.data.objectIDs[i]}`);
        if(resEach.data.objectBeginDate > params.start && resEach.data.objectEndDate < params.end){
          console.log(resEach.data);
          tempArray.push(resEach.data);
        }
      }
      
      
      // fetch from vam 
      const resVAM = await axios.get(`https://api.vam.ac.uk/v2/objects/search?q=${params.query}&images_exist=true&year_made_from=${params.start}&year_made_to=${params.end}`);
     
      // fetch from ham 
      const resHAM = await axios.get(`https://api.harvardartmuseums.org/object?q=${params.query}&hasimage=1&sort=random&apikey=99b15ddf-1529-4233-bb39-15c16dee8685`);

      setMetArtData(tempArray);
      setVamArtData(resVAM.data.records);
      console.log(resHAM.data)
      setHamArtData(resHAM.data.records);

      setLoading(false);

    }
    catch (error) {
        console.log(error);
    }
  
  }

  useEffect(() =>{
    fetchMuseumObjects();
    // fetchVAMObject();
  }, [])

  return (
    
    <VStack spacing={10} padding={3}>
      <Box pos='absolute' left="0px">
        <ColorModeSwitcher />
      </Box>
            {/* <Text fontSize="5xl" fontWeight="bold">Museum</Text> */}
            {loading ? <SkeletonCards /> : 

            metArtData.map((a, i) =>{
              return (
                <Box key={i} boxShadow='md' borderRadius="md" maxW="50rem" overflow="hidden" padding={5} >
                      <Heading 
                        mb={4} 
                        size='sm'
                      >
                        {a.title}
                      </Heading>

                    <Stack maxHeight="100%" maxWidth="100%">
                    
                    <Image src={a.primaryImageSmall}/>
                    </Stack>
                     
                    <Divider marginBottom="10px" marginTop="10px"/>
                      <Center>
                    <Stack  direction={{ base:"column", sm: "row" }} align='center'>

                    {a.culture && <Tag size='md' fontSize={{ base:'10px', lg: "15px" }} overflow='cover' variant="subtle" >
                        {a.culture}
                    </Tag>}

                    {a.objectDate && <Tag size='md'fontSize={{ base:'10px', lg: "15px" }} variant="subtle"  marginLeft="15px">
                        {a.objectDate}
                    </Tag>}

                    {a.subregion && 
                  
                  <Tag size='md' variant="subtle" fontSize={{ base:'10px', lg: "15px" }} marginLeft="15px">
                    <TagLeftIcon boxSize="16px" as={RiMapPinTimeLine} />
                    <TagLabel>{a.subregion}</TagLabel>
                    </Tag>}
                    </Stack>
                      </Center>

                </Box>
              )

            })
            }
            {loading ? <SkeletonCards /> : 

              vamArtData?.map((a, i) =>{
                return (
                  <Box key={i} boxShadow='md' borderRadius="md" maxW="50rem" overflow="hidden" padding={5} >
                        <Heading 
                          mb={4} 
                          size='sm'
                        >
                          {a._primaryTitle ? a._primaryTitle : a.objectType}
                        </Heading>

                      <Stack maxHeight="100%" maxWidth="100%">
                      
                      <Image   src={`https://framemark.vam.ac.uk/collections/${a._primaryImageId}/full/735,/0/default.jpg`}/>
                      </Stack>
                      
                      <Divider marginBottom="10px" marginTop="10px"/>
                        <Center>
                      <Stack  direction={{ base:"column", sm: "row" }} align='center'>

                      {a.objectType && <Tag size='md' fontSize={{ base:'10px', lg: "15px" }} overflow='cover' variant="subtle" >
                         Type:  {a.objectType}
                      </Tag>}

                      {a._primaryDate && <Tag size='md'fontSize={{ base:'10px', lg: "15px" }} variant="subtle"  marginLeft="15px">
                          {a._primaryDate}
                      </Tag>}

                      {a._primaryPlace && 
                    
                    <Tag size='md' variant="subtle" fontSize={{ base:'10px', lg: "15px" }} marginLeft="15px">
                      <TagLeftIcon boxSize="16px" as={RiMapPinTimeLine} />
                      <TagLabel>{a._primaryPlace}</TagLabel>
                      </Tag>}

                      </Stack>
                        </Center>

                  </Box>
                )

              })
              }

          {loading ? <SkeletonCards /> : 

          hamArtData?.map((a, i) =>{
            return (
              <Box key={i} boxShadow='md' borderRadius="md" maxW="50rem" overflow="hidden" padding={5} >
                    <Heading 
                      mb={4} 
                      size='sm'
                    >
                      {a.title ? a.title : 'Untitled'}
                    </Heading>

                  <Stack maxHeight="100%" maxWidth="100%">
                  
                  <Image src={a.primaryimageurl}/>

                  </Stack>
                  
                  <Divider marginBottom="10px" marginTop="10px"/>
                    <Center>
                  <Stack  direction={{ base:"column", sm: "row" }} align='center'>

                  {a.classification && <Tag size='md' fontSize={{ base:'10px', lg: "15px" }} overflow='cover' variant="subtle" >
                    Type:  {a.classification}
                  </Tag>}

                  {a.dated && <Tag size='md'fontSize={{ base:'10px', lg: "15px" }} variant="subtle"  marginLeft="15px">
                      {a.dated}
                  </Tag>}

                  {a.division && 
                
                <Tag size='md' variant="subtle" fontSize={{ base:'10px', lg: "15px" }} marginLeft="15px">
                  <TagLeftIcon boxSize="16px" as={RiMapPinTimeLine} />
                  <TagLabel>{a.division}</TagLabel>
                  </Tag>}

                  </Stack>
                    </Center>

              </Box>
            )

          })
          }

          <Stack align='center'>
          {/* <Button width='20vw' size="sm" onClick={fetchMetData}>Send Data</Button> */}
          </Stack>
          </VStack>
  );
}

export default Gallery;
