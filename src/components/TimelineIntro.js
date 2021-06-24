import React from 'react'

import Distort1 from '../assets/distort01.jpg'
import SmoothScroll from '../utils/SmoothScroll';

import CuneiformIntro from './typography/CuneiformIntro'

import ImageDistort from '../utils/ImageDistort';
import { 
    Box, 
    VStack, 
  } from '@chakra-ui/react';

import {
    deviceType,
} from 'detect-it';

import SkeletonIntro from './skeletons/SkeletonIntro';

const TimelineIntro = ({isLoading}) => {

    return ( 
    <>
        {deviceType == 'mouseOnly' ? 
        <>
        <VStack spacing={0} className='ImageDistortRoot' marginTop='100px !important' marginBottom='100px !important'>
            <Box className='ImageDistortItem'>
                {/* Country of the noble lords */}
                {isLoading ? 
                <SkeletonIntro /> : 
                    <>
                    <CuneiformIntro title='𒆠𒂗𒄀'/>

                <img hidden src={"https://upload.wikimedia.org/wikipedia/commons/7/7d/Ea_%28Babilonian%29_-_EnKi_%28Sumerian%29.jpg"} /> 
                    </>
                }
            </Box>

            <Box className='ImageDistortItem' >
            {isLoading ? 
                <SkeletonIntro /> : 
                <>
                <CuneiformIntro title='𒆠𒂗𒄀'/>
                <img hidden src={Distort1} />
                </>
            }
            </Box>
            <Box className='ImageDistortItem'>
            {isLoading ? 
                <SkeletonIntro /> : 
                <>
                    <CuneiformIntro title='𐎧𐏁𐎠𐎹𐎰𐎡𐎹'/>
                    <img hidden src={"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Standard_of_Ur_-_War.jpg/640px-Standard_of_Ur_-_War.jpg"} />
                </>
            }
            </Box>

            {!isLoading ? <ImageDistort
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
            <Box >
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
            <CuneiformIntro title='𒆠𒂗𒄀'/>
            <CuneiformIntro title='𒆠𒂗𒄀'/>
            <CuneiformIntro title='𐎧𐏁𐎠𐎹𐎰𐎡𐎹' fontSize='40px'/>
        </VStack>
        </>
        }
    </>
    );
}
 
export default TimelineIntro;