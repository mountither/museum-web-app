import React from 'react';
import {
  Box,
  Code,
  Text,
  Image,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Flex,
  useColorMode,
} from '@chakra-ui/react';

import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import Heading from './Typography/Heading';

import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

import './styles/swiper.css';

// import Swiper core and required modules
import SwiperCore, { Pagination } from 'swiper/core';

SwiperCore.use([Pagination]);

const TimelineDrawer = ({ drawerData, onClose }) => {
  const { colorMode } = useColorMode();

  return (
    <Drawer
      isOpen={true}
      placement="right"
      onClose={onClose}
      size="xl"
      isCentered="true"
      colorScheme="blackAlpha"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading
            title={drawerData.title}
            fontSize={{ base: '30px', lg: '40px' }}
          />
        </DrawerHeader>
        <DrawerBody
          marginBottom="-80px"
          paddingLeft={{ base: 5, lg: 20 }}
          paddingRight={{ base: 5, lg: 20 }}
        >
          <Text fontSize={{ base: '17px', lg: '22px' }} marginBottom="30px">
            {drawerData.content}
          </Text>
          {drawerData.subContents &&
            drawerData.subContents.map((c, i) => (
              <Box key={i} marginBottom="10px">
                <Heading
                  fontSize={{ base: '20px', lg: '30px' }}
                  fontWeight="bold"
                >
                  {c.title}
                </Heading>
                <Text fontSize={{ base: '17px', lg: '22px' }} marginTop="4px">
                  {c.content}
                </Text>
                {/* <Link to={{ pathname: '/gallery', state: { title: c.title } }}>
                  <Button
                    size="sm"
                    variant="outline"
                    mb={10}
                    mt={5}
                    textColor={'#FFFF'}
                    bgColor={'#679c9e'}
                    _hover={{ backgroundColor: '#679c9e', opacity: 0.8 }}
                  >
                    Discover Artefacts
                  </Button>
                </Link> */}
              </Box>
            ))}
          {drawerData.images && (
            <Swiper pagination={{ clickable: true}} className="swiper">
              {drawerData.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <Image src={img} fallback={<Code>Fetching Image...</Code>} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </DrawerBody>
        <Flex justify="center">
          <DrawerFooter>
            <Link
              to={{
                pathname: '/gallery',
                state: {
                  title: drawerData.title,
                  startPeriod: drawerData.dates.start,
                  endPeriod: drawerData.dates.end,
                },
              }}
            >
              <Button
                fontSize={{ base: '15px', lg: '20px' }}
                size="lg"
                variant="outline"
                fontWeight="normal"
                textColor={'#FFFF'}
                bgColor={'#679c9e'}
                mt={20}
                _hover={{ backgroundColor: '#679c9e', opacity: 0.8 }}
              >
                Discover Museum Artifacts from this period
              </Button>
            </Link>
          </DrawerFooter>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};

export default TimelineDrawer;
