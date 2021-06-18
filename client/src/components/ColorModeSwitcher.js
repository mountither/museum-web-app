import React from 'react';
import { useColorMode, useColorModeValue, Image, IconButton} from '@chakra-ui/react';

import SunToggle from '../assets/sun_toggle.png';
import MoonStarToggle from '../assets/moonstar_toggle.png';

export const ColorModeSwitcher = props => {

  const { toggleColorMode, colorMode} = useColorMode();
  
  const text = useColorModeValue('dark', 'light');

  return (
    <IconButton
    {...props}
    aria-label={`Switch to ${text} mode`}
    variant="ghost"
    color="current"
    marginLeft="2"
    onClick={toggleColorMode}
    size="md"
    fontSize="lg"
  >
    <Image
      cursor = 'pointer'
      width={10}
      src={colorMode == 'light' ? MoonStarToggle : SunToggle}
      {...props}
    />
  </IconButton>
 
  );
};
