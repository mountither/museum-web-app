import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { museumsDetails } from './GalleryCard';

import { FaWikipediaW } from 'react-icons/fa';

const SiteResources = () => {
  return (
    <Flex direction={'row'} alignItems="center" alignSelf={'center'}>
      <Box
        as="a"
        target="_blank"
        href={'https://en.wikipedia.org/wiki/History_of_Mesopotamia'}
        cursor={'pointer'}
        width="50px"
        _hover={{ opacity: 0.6 }}
        transition="opacity .6s"
      >
        <FaWikipediaW
          alt={`Wikipedia - History of Mesopotamia`}
          width="60%"
          objectFit="contain"
          padding={'5px'}
        />
      </Box>
      {Object.keys(museumsDetails).map((museum, i) => (
        <Box
          as="a"
          target="_blank"
          href={museumsDetails[museum].url}
          cursor={'pointer'}
          width="50px"
        >
          <Image
            src={museumsDetails[museum].logo}
            alt={`${museumsDetails[museum]} Logo`}
            width="60%"
            objectFit="contain"
            padding={'5px'}
            borderRadius={7}
            _hover={{ opacity: 0.6 }}
            transition="opacity .6s"
          />
        </Box>
      ))}
    </Flex>
  );
};

export default SiteResources;
