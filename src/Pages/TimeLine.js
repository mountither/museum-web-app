import React from 'react';

import {
  Box,
  Code,
  VStack,
  useColorMode,
  Image,
  Divider,
  useMediaQuery,
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
} from '@chakra-ui/react';

import ColorModeSwitcher from '../Components/ColorModeSwitcher';

import TimelineIntro from '../Components/TimelineIntro';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

import TimelineBox from '../Components/TimelineBox';

import Heading from '../Components/Typography/Heading';

import useWikiData from '../API/Wikipedia';

//https://github.com/rafgraph/detect-it#detection-details
// dont render mouse over img distort for touch screens and hybrid.
import { deviceType } from 'detect-it';
import { museumsDetails } from '../Components/GalleryCard';
import SiteResources from '../Components/SiteResources';

// import './styles/timeline.css'

const TimeLine = () => {
  // const images =[
  //   "https://upload.wikimedia.org/wikipedia/commons/c/c2/Gebel_el-Arak_Knife_ivory_handle_%28front_top_part_detail%29.jpg",
  //   "https://upload.wikimedia.org/wikipedia/commons/b/b7/Mesopotamia%2C_Periodo_proto-dinastico%2C_placca_con_scena_di_banchetto%2C_da_khafajah%2C_2650-2550_ac_ca.jpg",
  //   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Anubanini_extracted.jpg/1024px-Anubanini_extracted.jpg",
  //   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/N-Mesopotamia_and_Syria_english.svg/1280px-N-Mesopotamia_and_Syria_english.svg.png"
  // ]

  const [isLargerThan1280] = useMediaQuery('(min-width: 960px)');

  const { isLoading, data, error } = useWikiData({
    pageName: 'History_of_Mesopotamia',
  });

  const { colorMode } = useColorMode();

  return (
    <VStack spacing={10}>
      <Box pos="absolute" left="0px" top={'10px'}>
        <ColorModeSwitcher />
      </Box>

      <VStack>
        <Heading
          main
          title="History of Mesopotamia"
          gridArea={'1/1/2/3'}
          marginTop={10}
          paddingLeft={10}
          zIndex="1"
        />

        <Divider zIndex="-11" width={"80%"} />
      </VStack>

      <TimelineIntro isLoading={isLoading} />

      <Divider width="50vw" zIndex="-11" />

      <Box padding={0}>
        {error && (
          <Code fontSize="15px" marginBottom="50px">
            {error}
          </Code>
        )}
        {isLoading ? (
          <Code fontSize="15px" marginBottom="50px">
            Building Timeline...
          </Code>
        ) : (
          <Timeline
            align={isLargerThan1280 ? 'right' : 'right'}
            className="myListRoot"
            style={{ padding: '0px' }}
          >
            {data?.map((c, i) => {
              return (
                <TimelineItem key={i}>
                  <TimelineOppositeContent
                    style={{ paddingLeft: !isLargerThan1280 && '5px' }}
                  >
                    <Table marginBottom="100px" size={{ base: 'sm', lg: 'lg' }}>
                      <Tbody fontSize={{ base: '8px', lg: '18px', md: '12px' }}>
                        {c.dates && (
                          <Tr>
                            <Td padding="5px" fontWeight="semibold">
                              Period
                            </Td>
                            <Td>{c.dates}</Td>
                          </Tr>
                        )}
                        {c.nationsToday && (
                          <Tr>
                            <Td padding="5px" fontWeight="semibold">
                              Today
                            </Td>
                            <Td>{c.nationsToday}</Td>
                          </Tr>
                        )}
                        {c.majorReligion && (
                          <Tr>
                            <Td padding="5px" fontWeight="semibold">
                              Religion
                            </Td>
                            <Td>{c.majorReligion}</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent style={{ marginBottom: '5vh' }}>
                    <TimelineBox data={c}>
                      <Box
                        role="group"
                        style={{
                          pointerEvents: deviceType == 'touchOnly' && 'none',
                        }}
                      >
                        <Box
                          padding="10px"
                          _groupHover={{
                            backgroundColor:
                              colorMode === 'dark' ? '#1c2541' : '#EEEEEE',
                            WebkitTransition: 'background-color 0.4s linear',
                            msTransition: 'background-color 0.4s linear',
                            transition: 'background-color 0.4s linear',
                          }}
                          transition="background-color 0.3s linear"
                        >
                          <Box overflow="hidden" borderRadius={10}>
                            <Image
                              className="tl-image"
                              _groupHover={{ transform: 'scale(1.05)' }}
                              transition="transform .9s"
                              objectFit="contain"
                              src={c.images && c.images[c.images.length - 1]}
                            />
                          </Box>

                          <Heading marginTop="5px" title={c.title} />
                        </Box>
                      </Box>
                    </TimelineBox>
                    {/* <Divider /> */}
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        )}
      </Box>
      <Box mt={20}>
        <SiteResources />
      </Box>
    </VStack>
  );
};

export default TimeLine;
