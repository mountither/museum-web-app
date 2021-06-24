import React from 'react';
import { useColorMode, useColorModeValue, Image, IconButton} from '@chakra-ui/react';

import SunToggle from '../assets/sun_toggle.png';
import MoonToggle from '../assets/moon_toggle.png';

const ColorModeSwitcher = props => {

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
      src={colorMode == 'light' ? MoonToggle : SunToggle}
      {...props}
    />
  </IconButton>
 
  );
};

export default ColorModeSwitcher;