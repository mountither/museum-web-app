import React, {useEffect, useState} from 'react';
import {
  Link
} from "react-router-dom";

import wiki from 'wikijs';
import { Box, Code, Text, VStack, Image, Heading, Divider, HStack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useMediaQuery,
  Input,
  Button,
  Fade,
  Collapse,
  Flex,
  useColorMode
        } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import ImageDistort from '../utils/ImageDistort';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
//https://github.com/rafgraph/detect-it#detection-details
// dont render mouse over img distort for touch screens and hybrid.
import {
  deviceType,
} from 'detect-it';


import Distort1 from '../assets/distort01.jpg'
import SmoothScroll from '../utils/SmoothScroll';
import { Swiper, SwiperSlide } from "swiper/react";

import {ExtractRandomElements} from '../utils/ArrayHelpers'
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"
import "./styles/timeline.css"

// import Swiper core and required modules
import SwiperCore, {
  Pagination
} from 'swiper/core';
import SkeletonIntro from '../components/Skeletons/SkeletonIntro';
import SkeletonCards from '../components/Skeletons/SkeletonCards';

// install Swiper modules
SwiperCore.use([Pagination]);

// TODO - either character with image distort bg or map with major cities with image distort of relevant pieces.
const TimeLine =() => {

    const images =[
      "https://upload.wikimedia.org/wikipedia/commons/c/c2/Gebel_el-Arak_Knife_ivory_handle_%28front_top_part_detail%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Mesopotamia%2C_Periodo_proto-dinastico%2C_placca_con_scena_di_banchetto%2C_da_khafajah%2C_2650-2550_ac_ca.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Anubanini_extracted.jpg/1024px-Anubanini_extracted.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/N-Mesopotamia_and_Syria_english.svg/1280px-N-Mesopotamia_and_Syria_english.svg.png"
    ]

    const { colorMode } = useColorMode()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const boxClickRef = React.useRef()
    const [histData, setHistData] = useState([]);
    const [drawerContent, setDrawerContent] = useState({});

    const [isLargerThan1280] = useMediaQuery("(min-width: 960px)");

    const [fetchingWikiData, setFetchingWikiData] = useState(true);
  
    const fetchWikiPageContent = async () =>{
      try {

        setFetchingWikiData(true);

        const pageResponse = await wiki({
            apiUrl: 'https://en.wikipedia.org/w/api.php'
          }).page("History_of_Mesopotamia")
            
        const pageContent = await pageResponse.content();
        const filterPageCont = pageContent.filter(c => 
            (c.title != "See also" 
            && c.title !== 'References'
            && c.title !== 'Further reading' 
            && c.title !== 'External links'
            && c.title !== 'Classical writers'
            && c.title !== 'Short outline of Mesopotamia'
            )
            );

        // imgs to be appended
        const itemsArr = [];
        await filterPageCont.map((c, i) =>{
          c.items?.map((ci, i) => {
            if(ci.title == "Early Dynastic period"){
              ci.title = "Early Dynastic period (Mesopotamia)"
            }
            itemsArr.push(ci);
          })
        });

        await Promise.all(
          itemsArr.map(async (item) =>{
          item.images = await fetchPeriodWikiPage(item.title);
          }
        ))

        setHistData(itemsArr);
        // store array in session
        sessionStorage.setItem('TLData', JSON.stringify(itemsArr));

        setFetchingWikiData(false);

        }catch(error){
            console.log(error);
        }
    }

    const fetchPeriodWikiPage = async(title) => {

      // const test = await wiki({
      //   apiUrl: 'https://en.wikipedia.org/w/api.php'
      // }).find(title)

      // console.log(title, testInfo)
      // find() searches and returns the first wiki page.
      const searchResponse = await wiki({
        apiUrl: 'https://en.wikipedia.org/w/api.php'
      }).find(title)
      const pageImages = await searchResponse.images();
      const pageInfo = await searchResponse.info();
      console.log(pageInfo)
      const imgExtRegex = "https?:\/\/.*\.(?:png|jpg|JPG|PNG)";
      const excludeSVG = pageImages.filter(img => {
        return img.match(imgExtRegex);
      });

      // var finalImgs = [];
      // if(excludeSVG.length < 10){
      //   finalImgs = excludeSVG;
      // }
      // else{
      //   finalImgs = excludeSVG.slice(0, 10);

      // }

      // return finalImgs;

      return ExtractRandomElements(excludeSVG, excludeSVG.length < 5 ? 1 : 5);
    }

    useEffect(() => {
      //  if TL Data is empty, fetch from wiki api
      if(sessionStorage.getItem("TLData") != null && sessionStorage.getItem("TLData") != "[]"){
        // console.log('dsga ', sessionStorage.getItem('TLData') )
        const LSHist = JSON.parse(sessionStorage.getItem('TLData'));
        setHistData(LSHist);
        setFetchingWikiData(false);
      }
      else{
        console.log('fetching')
        fetchWikiPageContent();
      }
    }, [])

    const onOpenDrawer= (title, content, subcontents = null, images = null)=>{
      onOpen();
      setDrawerContent({title: title, content: content, subContents: subcontents, images: images});
    }

    return (

      <VStack spacing={10} padding={3}>

       <Box pos='absolute' left="0px">
        <ColorModeSwitcher />
      </Box>

      <VStack >

          <Heading 
          zIndex='1'
          marginTop={10} 
          gridArea={'1/1/2/3'} 
          fontSize={{lg:'9xl', base:'6xl'}} 
          marginLeft={3} 
          textTransform='uppercase'
        >Land Of Rivers
        </Heading>
      <Divider/>
    </VStack>


    {deviceType == 'mouseOnly' ? 

  

       <VStack spacing={0} className='ImageDistortRoot' marginTop='100px !important' marginBottom='100px !important'>
        {/* <img style={{zIndex:'-20'}} src={"https://upload.wikimedia.org/wikipedia/en/b/b8/NC_Mesopotamia_sites.jpg"}/> */}
        
          <Box className='ImageDistortItem'>
            {/* Country of the noble lords */}
            {fetchingWikiData ? 
              <SkeletonIntro /> : 
                <>
                <Text fontSize="80px" _hover={{color:'white'}} style={{MozUserSelect: 'none', userSelect:'none', WebkitUserSelect:'none'}} >𒆠𒂗𒄀</Text>
            <img hidden src={"https://upload.wikimedia.org/wikipedia/commons/7/7d/Ea_%28Babilonian%29_-_EnKi_%28Sumerian%29.jpg"} /> 
                </>
            }
          </Box>

          <Box className='ImageDistortItem' >
          {fetchingWikiData ? 
            <SkeletonIntro /> : 
              <>
            <Text fontSize="80px" _hover={{color:'white'}} style={{MozUserSelect: 'none', userSelect:'none', WebkitUserSelect:'none'}} >𒆠𒂗𒄀</Text>
            <img hidden src={Distort1} />
            </>
          }
          </Box>
          <Box className='ImageDistortItem'>
          {fetchingWikiData ? 
            <SkeletonIntro /> : 
              <>
               <Text  fontSize="80px" _hover={{color: 'white'}} style={{MozUserSelect: 'none', userSelect:'none', WebkitUserSelect:'none'}}>𐎧𐏁𐎠𐎹𐎰𐎡𐎹</Text>
                <img hidden src={"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Standard_of_Ur_-_War.jpg/640px-Standard_of_Ur_-_War.jpg"} />
              </>
          }
          </Box>

        {!fetchingWikiData && <ImageDistort
                        styles={{ zIndex: -10 }}
                        listRoot={".ImageDistortRoot"}
                        itemRoot={".ImageDistortItem"}
                        options={{
                          strength: 0.5,
                          effect: "redshift",
                          geometry: {
                            shape: "plane",
                            // radius: 0.4,
                            // segments: 128,
                            width: 0.8,
                            height: 0.8
                            
                          }
                        }}
                      />}
        </VStack>
      
      : 
      <SmoothScroll>

      <VStack spacing='30px' zIndex='-10'  opacity='0.4' >
        {/* <img style={{zIndex:'-20'}} src={"https://upload.wikimedia.org/wikipedia/en/b/b8/NC_Mesopotamia_sites.jpg"}/> */}
        <Box >
        {/* Country of the noble lords */}
        <img  src={"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Standard_of_Ur_-_War.jpg/640px-Standard_of_Ur_-_War.jpg"} />
        </Box>
        <Box >
        <img  src={Distort1} />
        </Box>
        <Box>
        <img src={"https://upload.wikimedia.org/wikipedia/commons/7/7d/Ea_%28Babilonian%29_-_EnKi_%28Sumerian%29.jpg"} />

        </Box>
        </VStack>
      </SmoothScroll>
    }

      <Divider width='50vw' />

      <Box padding={0}>

      {fetchingWikiData ? <Code fontSize='25px'>Building Timeline...</Code> :

        <Timeline align={isLargerThan1280 ? 'alternate' : 'left'} className="myListRoot">

          {histData?.map((c,i) => {
              return(

                  <TimelineItem key={i} >
                     <TimelineOppositeContent>
                      <Text colorScheme='gray' fontSize={{ base:'10px', lg: "15px" }}>5000 B.C - 2000 B.C</Text>
                 </TimelineOppositeContent>
                    <TimelineSeparator >
                      <TimelineDot />
                      <TimelineConnector />

                    </TimelineSeparator>

                      <TimelineContent style={{marginBottom:'5vh'}}>
                        <Box
                          ref={boxClickRef} 
                          onClick={() => onOpenDrawer(c.title, c.content, c.items &&c.items, c.images && c.images)}
                          maxWidth='4xl' 
                          width={!isLargerThan1280 && '50vw'}
                          // padding='10px' 
                          borderBottom='0.5px solid grey'
                          cursor='pointer'
                          align='center'
                            >
                          <Box overflow="hidden" >
                          <Image  _hover={{transform: 'scale(1.05)'}}  transition='transform .9s' objectFit="contain" 
                          src={c.images && c.images[c.images.length-1]}/>
                      
                      </Box>  

                          <Text 
                           fontSize={{ base:'10px', lg: "22px" }}>{c.title}</Text>
                         
                        </Box>
                        </TimelineContent>         
                </TimelineItem>
                )
              }
            )}
          
        </Timeline>
    }
      </Box>

     {isOpen && <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={boxClickRef}
          size='xl'
          isCentered='true'
          colorScheme='blackAlpha'
          >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton  />
              <DrawerHeader>{drawerContent.title}</DrawerHeader>
              {console.log("object")}
              <DrawerBody marginBottom='-80px' paddingLeft={{ base: 5, lg: 20 }} paddingRight={{ base: 5, lg: 20 }}>
                <Text marginBottom='30px'>{drawerContent.content}</Text>
                {drawerContent.subContents && drawerContent.subContents.map((c, i) => (
                  <Box key={i} marginBottom='10px'>
                    <Text fontWeight='bold'>{c.title}</Text>
                    <Text>{c.content}</Text>
                    <Link to={{ pathname: '/gallery', state:{ title : c.title}}}>
                <Button  size='sm' variant="outline"  mb={10} mt={5}>
                  Discover Artefacts</Button></Link>
                  </Box>
                ))}
                <Swiper pagination={true} className="swiper">
                    {drawerContent.images && drawerContent.images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <Image src={img} fallback={<Code>Fetching Image...</Code>}/>
                      </SwiperSlide>
                    )
                    )
                    }
                </Swiper>
              </DrawerBody>
              
          <Flex justify='center'>
              <DrawerFooter >


              <Link to={{ pathname: '/gallery', state:{ title : drawerContent.title}}}>
                <Button  size='lg' variant="outline"  mt={20}>
                  Discover Artefacts from this period</Button></Link>
              </DrawerFooter>
          </Flex>
            </DrawerContent>
          </Drawer>}
      </VStack>
    );
  }

  export default TimeLine;