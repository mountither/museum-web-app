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
  Flex,
  Text,
} from '@chakra-ui/react';

// params: the content to be shown on card.
// reqs: image, date
// others are props

export const museumsDetails = {
  MET: {
    logo: '/images/museum-logos/met-logo.svg',
    url: 'https://www.metmuseum.org/',
  },
  VAM: {
    logo: '/images/museum-logos/vam-logo.svg',
    url: 'https://www.vam.ac.uk/',
  },
  HAM: {
    logo: '/images/museum-logos/ham-logo.jpeg',
    url: 'https://harvardartmuseums.org/',
  },
  SMG: {
    logo: '/images/museum-logos/smg-logo.png',
    url: 'https://www.sciencemuseumgroup.org.uk/',
  },
  MVC: {
    logo: '/images/museum-logos/mvc-logo.svg',
    url: 'https://museumsvictoria.com.au/',
  },
  AIC: {
    logo: '/images/museum-logos/aic-logo.png',
    url: 'https://www.artic.edu/',
  },
};

const GalleryCard = ({
  title,
  imgURL,
  dateCreation,
  region,
  restPayload,
  museum,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      boxShadow={colorMode === 'dark' ? 'dark-lg' : 'sm'}
      borderRadius="md"
      maxW="70rem"
      padding={5}
    >
      <Flex
        justifyContent={'space-between'}
        direction={'row'}
        alignItems={'center'}
        mb={2}
        gridGap={4}
      >
        <Heading size="sm" fontSize={{ base: '15px', lg: '25px' }}>
          {title ? title : 'Untitled'}
        </Heading>
          <Box
            as="a"
            target="_blank"
            href={museumsDetails[museum].url}
            cursor={'pointer'}
            width="50px"
          >
            <Image
              src={museumsDetails[museum].logo}
              alt={`${museum} Logo`}
              width="100%"
              objectFit="contain"
              padding={'5px'}
              borderRadius={7}
              _hover={{ opacity: 0.6 }}
              transition="opacity .6s"
            />
          </Box>
      </Flex>

      <Stack maxHeight="100%" overflow="hidden" maxWidth="100vw">
        <Image
          _hover={{ transform: 'scale(1.03)' }}
          transition="transform .6s"
          objectFit="contain"
          src={imgURL}
        />
      </Stack>

      <Center>
        <Stack spacing={4} direction={{ base: 'column' }} align="center">
          <Table>
            <Tbody fontSize={{ base: '10px', lg: '15px' }}>
              {dateCreation ? (
                <Tr>
                  <Td fontWeight="semibold">Date Created</Td>
                  <Td>{dateCreation}</Td>
                </Tr>
              ) : null}
              {region ? (
                <Tr>
                  <Td fontWeight="semibold">Region</Td>
                  <Td>{region}</Td>
                </Tr>
              ) : null}
              {restPayload &&
                restPayload.map((o, i) =>
                  o?.data ? (
                    <Tr key={i}>
                      <Td fontWeight="semibold">{o.type}</Td>
                      <Td>{o.data}</Td>
                    </Tr>
                  ) : null
                )}
            </Tbody>
          </Table>
        </Stack>
      </Center>
    </Box>
  );
};

export default GalleryCard;
