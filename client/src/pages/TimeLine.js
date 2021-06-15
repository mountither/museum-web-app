import React, {useEffect, useState} from 'react';

import wiki from 'wikijs';
import { Box, Code, Text, VStack, Image, Heading, Divider } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import ImageDistort from '../utils/ImageDistort';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";

import ExtractRandomElements from "../utils/ExtractRandomElements";

import i1 from '../assets/i1.png';
import i2 from '../assets/i2.png';
import i3 from '../assets/i3.png';
import i4 from '../assets/i4.png';
import i5 from '../assets/i5.png';

const TimeLine =() => {
    const images =[
      "https://upload.wikimedia.org/wikipedia/commons/c/c2/Gebel_el-Arak_Knife_ivory_handle_%28front_top_part_detail%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Mesopotamia%2C_Periodo_proto-dinastico%2C_placca_con_scena_di_banchetto%2C_da_khafajah%2C_2650-2550_ac_ca.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Anubanini_extracted.jpg/1024px-Anubanini_extracted.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/01/Assyrian_Crown-Prince_MET_DP-13006-005.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/N-Mesopotamia_and_Syria_english.svg/1280px-N-Mesopotamia_and_Syria_english.svg.png"
    ]

    
    const [histData, setHistData] = useState([]);
    const [intro, setIntro] = useState([]);
    const [isDesktop, setIsDesktop] = useState(false);

    const fetchWikiPageContent = async () =>{
      try {
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
        console.log(filterPageCont);

        setIntro(pageContent.filter(topic => {
          return topic.title == "Short outline of Mesopotamia"
        }));

        setHistData(filterPageCont);

        }catch(error){
            console.log(error);
        }
    }



    useEffect(() => {
       fetchWikiPageContent();

       setIsDesktop(window.innerWidth > 1200)
       console.log(window.innerWidth > 1200);

    }, [])


    return (

      <VStack spacing={10} padding={3}>

       <Box pos='absolute' left="0px">
        <ColorModeSwitcher />
      </Box>

      <Heading 
       
       marginTop={10} 
       gridArea={'1/1/2/3'} 
       fontSize={{lg:'9xl', base:'5xl'}} 
       marginLeft={3} 
       fontWeight="bold" 
       fontStyle='italic'  >Mesopotamia<Divider/></Heading>
    
    <Box padding={10}>
      {intro[0] && <Code>{intro[0].content}</Code>}
    </Box>


      <Box marginTop={10} padding={3}  style={{ width: "100%", height: "100%" }}>


        <Timeline align='right' className="myListRoot" >

          {histData.map((c,i) => {
              return(
                  <TimelineItem key={i} >
                  <TimelineOppositeContent className="myListItem" >

                      <Code fontSize={{ base:'10px', lg: "14px" }} >{c.content}
                      {
                          c.items && c.items.map((cc,ci) => (<Text key={ci}>{cc.title}</Text>))
                      }
                      </Code>
                      <img hidden src={images[i]} />

                  </TimelineOppositeContent>

                  <TimelineSeparator  style={{zIndex:'-11'}}>
                    <TimelineDot />
                    <TimelineConnector />

                  </TimelineSeparator>

                {isDesktop &&  <ImageDistort
                    styles={{ zIndex: -10 }}
                    listRoot={".myListRoot"}
                    itemRoot={".myListItem"}
                    options={{
                      strength: 0.7,
                      effect: "redshift",
                      geometry: {
                        shape: "circle",
                        radius: 0.2,
                        segments: 128,
                        width: 0.9,
                        height: 0.9
                        
                      }
                    }}
                  />}
                  <TimelineContent><Code fontSize={{ base:'10px', lg: "14px" }}>{c.title}</Code></TimelineContent>
                </TimelineItem>

              )
          }) 
          }
          
        </Timeline>
      

        {/* <Chrono items={items} mode='VERTICAL_ALTERNATING' hideControls /> */}

    
      </Box>


      

      </VStack>
    );
  }

  export default TimeLine;