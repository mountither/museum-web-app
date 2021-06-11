import React from 'react';
import {
  ChakraProvider,
  extendTheme 
} from '@chakra-ui/react';

import Gallery from './pages/Gallery';
import { createBreakpoints } from "@chakra-ui/theme-tools"

const breakpoints = createBreakpoints({
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
})

const fonts = {
  heading: "Open Sans",
  body: "Raleway",
},

const theme = extendTheme({ breakpoints, fonts})

const App = ()=> {
  return (
    <ChakraProvider theme={theme}>
     <Gallery/>
    </ChakraProvider>
  );
}

export default App;
