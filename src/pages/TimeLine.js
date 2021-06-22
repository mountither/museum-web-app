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
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
  useColorMode
        } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
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
import "./styles/swiper.css"




// import Swiper core and required modules
import SwiperCore, {
  Pagination
} from 'swiper/core';
import SkeletonIntro from '../components/Skeletons/SkeletonIntro';

// install Swiper modules
SwiperCore.use([Pagination]);

// TODO - either character with image distort bg or map with major cities with image distort of relevant pieces.
const TimeLine =() => {

    // const images =[
    //   "https://upload.wikimedia.org/wikipedia/commons/c/c2/Gebel_el-Arak_Knife_ivory_handle_%28front_top_part_detail%29.jpg",
    //   "https://upload.wikimedia.org/wikipedia/commons/b/b7/Mesopotamia%2C_Periodo_proto-dinastico%2C_placca_con_scena_di_banchetto%2C_da_khafajah%2C_2650-2550_ac_ca.jpg",
    //   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Anubanini_extracted.jpg/1024px-Anubanini_extracted.jpg",
    //   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/N-Mesopotamia_and_Syria_english.svg/1280px-N-Mesopotamia_and_Syria_english.svg.png"
    // ]

    // const { colorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const boxClickRef = React.useRef()
    const [timelineData, setTimelineData] = useState([]);
    const [drawerData, setDrawerData] = useState({});

    const [isLargerThan1280] = useMediaQuery("(min-width: 960px)");

    const [fetchingWikiData, setFetchingWikiData] = useState(true);
  
    const fetchPeriodWikiData = async(title) => {

      // find() searches and returns the first wiki page.
      const searchResponse = await wiki({
        apiUrl: 'https://en.wikipedia.org/w/api.php'
      }).find(title)

      const pageImages = await searchResponse.images();
      const pageInfo = await searchResponse.fullInfo();
      const [readDate, queryDate] = formatDates(pageInfo.general, title);
      const currentNations = pageInfo.general?.today?.join(', ') || null;
      const majorReligion = pageInfo.general?.religion || null;

      const includeRegex = /\b(jpg|JPG|png)\b/i
      const excludeRegex = /\b(Blank|Blank_space)\b/i

      const filteredImageURLs = pageImages.filter(img => {
        return includeRegex.test(img) && !excludeRegex.test(img)
      });

      // [images ([]), dates (str), curr nations (str)]
      return [ExtractRandomElements(filteredImageURLs, filteredImageURLs.length < 5 ? 1 : 5), readDate, queryDate, currentNations, majorReligion];
    }

    // generalInfo object includes differing fields that represent the date period.
    const formatDates = (dataObj, periodName) => {

      //* potential date fields: 
      // yearStart/yearEnd, dates, lifeSpan
      // lifeSpan should take precendence. Followed by yearStart/End and finally dates.
      // yearStart/End + lifeSpan must include digits. 

      const containsDigits = /\d/;
      // intention: start/end in object -> match[0], match[1]
      const extractDigits = /([0-9,]+)/g;

      var readableDates = '';
      var queryableDate = {start: '', end: ''};

      if(dataObj.lifeSpan && containsDigits.test(dataObj.lifeSpan)){
        readableDates =  dataObj.lifeSpan;
      }
      else if(dataObj.yearStart && dataObj.yearEnd 
              && containsDigits.test(dataObj.yearStart)
              && containsDigits.test(dataObj.yearEnd)){
        
        readableDates = dataObj.yearStart + ' - ' + dataObj.yearEnd;
      }
      else if(dataObj.dates && containsDigits.test(dataObj.dates)){
        readableDates = dataObj.dates;
      }
      else{
        // check specific periods and allocate manually.
        switch (periodName) {
          case "Pre-Pottery Neolithic period":
            readableDates = "c. 10,000 — 6,500 BCE";
            break;
          case "Chalcolithic period":
            readableDates = "c. 6000 - 3300 BCE";
            break;
          case "Early Dynastic period (Mesopotamia)":
            readableDates = "c. 2900 – 2350 BCE"
            break;
          case "Akkadian Empire":
            readableDates = "c. 2334 – 2154 BCE"
            break;
          case "Hurrians":
            readableDates = "c. 1600 - c. 1000 BCE"
            break;
          case "Bronze Age collapse":
            readableDates = "c. 1200 - 1150 BCE"
            break;
          case "Classical Antiquity to Late Antiquity":
            readableDates = "c. 539 BCE - 800 CE"
            break;
          default:
            break;
        }
      }

      const dateSet = readableDates.match(extractDigits);
      var dash = true;

      // BCE
      if(periodName == "Classical Antiquity to Late Antiquity"){
        dash = false
      }
      
      queryableDate = {start: `-${dateSet[0]?.replace(/,/g, '')}`, end: `${dash ? '-' : ''}${dateSet[1]?.replace(/,/g, '')}`}

      return [readableDates, queryableDate]

    }

    // object to be used in drawer and eventually in gallery.
    const onOpenDrawer = (dataObject)=>{
      onOpen();
      setDrawerData({
        title: dataObject.title, 
        content: dataObject.mainContent, 
        subContents: dataObject.items || null, 
        images: dataObject.imageSet || null,
        dates: dataObject.dates
      });
    }

    useEffect(() => {
      //  if TL Data is empty, fetch from wiki api
      if(sessionStorage && sessionStorage.getItem("TLData") != null && sessionStorage.getItem("TLData") != "[]"){
        // console.log('dsga ', sessionStorage.getItem('TLData') )
        const LSTLData = JSON.parse(sessionStorage.getItem('TLData'));
        setTimelineData(LSTLData);
        setFetchingWikiData(false);

      }
      else{

        // for cancelling wiki api fetch. 
        let isSubscribed = true

        const fetchWikiPageContent = async () => {
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
            if(isSubscribed){
    
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
                [item.images, item.dates, item.dateQuery, item.nationsToday, item.majorReligion] = await fetchPeriodWikiData(item.title);
                }
              ))
              setTimelineData(itemsArr);
    
              
              try{
                // store array in session
                sessionStorage.setItem('TLData', JSON.stringify(itemsArr));
              }
              catch(error){
                console.log('Failed to set data in session storage ', error);
              }
              setFetchingWikiData(false);
            }
          }
          catch(error){
              console.log(error);
          }
        };

        fetchWikiPageContent();

        return () => {
          setFetchingWikiData(false);
          isSubscribed = false;
        }
      }
    }, [])


    return (

      <VStack spacing={10} >

       <Box pos='absolute' left="0px">
        <ColorModeSwitcher />
      </Box>

      <VStack >

          <Heading 
          zIndex='1'
          marginTop={10} 
          gridArea={'1/1/2/3'} 
          fontSize={{lg:'9xl', base:'6xl'}} 
          paddingLeft={10}
          textTransform='uppercase'
        >The Land Of Rivers
        </Heading>
      <Divider zIndex='-11'/>
    </VStack>


    {deviceType == 'mouseOnly' ? 
      <>
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

        {!fetchingWikiData ? <ImageDistort
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
                      />
        : null} 
        </VStack>
      </>
      
      : 
      <>
      <SmoothScroll>

      <VStack width='75vw'  marginTop='50px' spacing='40px' zIndex='-10'  >
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
      <VStack pos='absolute' zIndex='-20' opacity='0.7' top='75vh'>
      <Text fontSize="80px" _hover={{color:'white'}} style={{MozUserSelect: 'none', userSelect:'none', WebkitUserSelect:'none'}} >𒆠𒂗𒄀</Text>
      <Text fontSize="80px" _hover={{color:'white'}} style={{MozUserSelect: 'none', userSelect:'none', WebkitUserSelect:'none'}} >𒆠𒂗𒄀</Text>
      <Text fontSize="80px" _hover={{color:'white'}} style={{MozUserSelect: 'none', userSelect:'none', WebkitUserSelect:'none'}} >𒆠𒂗𒄀</Text>
    </VStack>
    </>
    }

<Divider width='50vw' zIndex='-11' />

      <Box padding={0}>

      {fetchingWikiData ? <Code fontSize='15px'>Building Timeline...</Code> :

        <Timeline align={isLargerThan1280 ? 'right' : 'right'} className="myListRoot" style={{padding:'0px'}}>

          {timelineData?.map((c,i) => {
              return(

                  <TimelineItem key={i}>
                     <TimelineOppositeContent style={{paddingLeft:!isLargerThan1280 && '5px'}}>
                      <Table marginBottom='100px' size={{base: 'sm', lg:'lg'}}>
                        <Tbody fontSize={{ base:'8px', lg: "18px", md:"12px" }}>
                          {c.dates && 
                          <Tr>
                            <Td padding='5px' fontWeight='semibold'>Period</Td>
                            <Td>{c.dates}</Td>
                          </Tr>
                          }
                          {c.nationsToday && 
                            <Tr>
                              <Td padding='5px' fontWeight='semibold'>Today</Td>
                              <Td>{c.nationsToday}</Td>
                            </Tr>
                            }
                            {c.majorReligion && 
                            <Tr >
                              <Td padding='5px' fontWeight='semibold'>Religion</Td>
                              <Td >{c.majorReligion}</Td>
                            </Tr>
                            }
                        </Tbody>
                    </Table>
                      
                 </TimelineOppositeContent>
                 <TimelineSeparator > 
                      <TimelineDot />
                      < TimelineConnector />
                    </TimelineSeparator>  
                      <TimelineContent style={{marginBottom:'5vh'}}>
                        <Box
                          ref={boxClickRef} 
                          onClick={() => onOpenDrawer({
                            title: c.title, 
                            mainContent: c.content, 
                            items: c.items &&c.items, 
                            imageSet: c.images && c.images,
                            dates: c.dateQuery
                            })}
                          maxWidth='4xl' 
                          width={!isLargerThan1280 && '40vw'}
                          // padding='10px' 
                          // borderBottom='0.5px solid grey'
                          cursor='pointer'
                          align='center'
                            >
                          <Box overflow="hidden" >
                          <Image 
                          className="tl-image"
                           _hover={{transform: 'scale(1.05)'}} style={{pointerEvents:deviceType == 'touchOnly' && 'none'}} 
                           transition='transform .9s' 
                           objectFit="contain" 
                          src={c.images && c.images[c.images.length-1]}/>
                      
                      </Box> 
                          <Heading 
                          fontWeight='medium'
                           fontSize={{ base:'15px', lg: "30px" }}>{c.title}</Heading>
                         
                        </Box>
                        <Divider />
                        
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
          placement="right"
          onClose={onClose}
          finalFocusRef={boxClickRef}
          size='xl'
          isCentered='true'
          colorScheme='blackAlpha'
          >
          <DrawerOverlay />
          <DrawerContent>
              
            <DrawerCloseButton  />
              <DrawerHeader >
                <Heading fontSize={{ base:'30px', lg: "40px" }}>{drawerData.title}</Heading>
              </DrawerHeader>
              <DrawerBody marginBottom='-80px' paddingLeft={{ base: 5, lg: 20 }} paddingRight={{ base: 5, lg: 20 }}>
                <Text fontSize={{ base:'17px', lg: "22px" }} marginBottom='30px'>{drawerData.content}</Text>
                {drawerData.subContents && drawerData.subContents.map((c, i) => (
                  <Box key={i} marginBottom='10px'>
                    <Heading fontSize={{ base:'20px', lg: "30px" }} fontWeight='bold'>{c.title}</Heading>
                    <Text fontSize={{ base:'17px', lg: "22px" }} marginTop='4px'>{c.content}</Text>
                    <Link to={{ pathname: '/gallery', state:{ title : c.title}}}>
                <Button  size='sm' variant="outline"  mb={10} mt={5}>
                  Discover Artefacts</Button></Link>
                  </Box>
                ))}
                {drawerData.images &&
                <Swiper pagination={true} className="swiper">
                    {drawerData.images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <Image src={img} fallback={<Code>Fetching Image...</Code>}/>
                      </SwiperSlide>
                    ))
                    }
                    
                </Swiper>
              }
              </DrawerBody>
              <Flex justify='center'>
              <DrawerFooter >


              <Link to={{ pathname: '/gallery', state:{ title : drawerData.title, startPeriod: drawerData.dates.start, endPeriod: drawerData.dates.end}}}>
                <Button fontSize={{ base:'15px', lg: "20px" }} size='lg' variant="outline" fontWeight='normal' mt={20}>
                  Discover Museum Artefacts from this period</Button></Link>
              </DrawerFooter>
              </Flex>
            </DrawerContent>
          </Drawer>}
      </VStack>
    );
  }

  export default TimeLine;