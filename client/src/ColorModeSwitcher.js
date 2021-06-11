import React from 'react';
import { useColorMode, useColorModeValue, IconButton} from '@chakra-ui/react';
import { WiMoonWaningCrescent5 } from "react-icons/wi";
import {IoIosSunny} from "react-icons/io";


export const ColorModeSwitcher = props => {

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(WiMoonWaningCrescent5, IoIosSunny);

  return (
    <IconButton
      size="md"
      fontSize="25px"
      aria-label={`Switch to ${text} mode`}
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      {...props}
    />

  
  );
};
