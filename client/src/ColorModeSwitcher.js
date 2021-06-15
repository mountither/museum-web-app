import React from 'react';
import { useColorMode, useColorModeValue, Image} from '@chakra-ui/react';

import SunToggle from './assets/sun_toggle.png';
import MoonStarToggle from './assets/moonstar_toggle.png';


export const ColorModeSwitcher = props => {

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(MoonStarToggle, SunToggle);

  return (
    <Image
      cursor = 'pointer'
      aria-label={`Switch to ${text} mode`}
      marginLeft="3"
      width={10}
      src={SwitchIcon}
      onClick={toggleColorMode}
      // icon={<SwitchIcon />}
      {...props}
    />

  
  );
};
