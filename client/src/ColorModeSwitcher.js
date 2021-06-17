import React from 'react';
import { useColorMode, useColorModeValue, Image} from '@chakra-ui/react';

import SunToggle from './assets/sun_toggle.png';
import MoonStarToggle from './assets/moonstar_toggle.png';


export const ColorModeSwitcher = props => {

  const { toggleColorMode, colorMode} = useColorMode();
  
  // const text = useColorModeValue('dark', 'light');
  // const SwitchIcon = useColorModeValue(MoonStarToggle, SunToggle);

  // seperate image components. prev method not working in safari.
  return (
    <>
  {  colorMode == 'light' ?
    <Image
      cursor = 'pointer'
      // aria-label={`Switch to ${text} mode`}
      marginLeft="3"
      width={10}
      src={MoonStarToggle }
      onClick={toggleColorMode}
      {...props}
    />
    : 
      <Image
      cursor = 'pointer'
      // aria-label={`Switch to ${text} mode`}
      marginLeft="3"
      width={10}
      src={SunToggle }
      onClick={toggleColorMode}
      {...props}
    />
    }
    </>
  );
};
