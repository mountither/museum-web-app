import React from 'react';
import {
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import { createBrowserHistory } from "history";

import Gallery from './pages/Gallery';
import TimeLine from "./pages/TimeLine";

import { createBreakpoints } from "@chakra-ui/theme-tools"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import "@fontsource/cardo/400.css"
import "@fontsource/open-sans/400.css"


const breakpoints = createBreakpoints({
  xs: "350px",
  sm: "450px",
  md: "767px",
  lg: "960px",
  xl: "1200px",
})

const fonts = {
  heading: "Cardo",
  body: "Open Sans",
}
const scrollbarConfig = {
  '&::-webkit-scrollbar': {
    width: '10px',
  },
  '&::-webkit-scrollbar-track': {
    width: '10px',
  }
}

const styles = {
  global: props => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.200', '#141214')(props),
      ...scrollbarConfig, 
      '&::-webkit-scrollbar-thumb': {
        background:  mode('gray.300', 'gray.700')(props),
        borderRadius: '24px',
      }
    },
  }),
};

const components = {
  Drawer: {
    // setup light/dark mode component defaults
    baseStyle: props => ({
      dialog: {
        bg: mode('white', '#1b1b1c')(props),
      },
      body:{
        ...scrollbarConfig, 
        '&::-webkit-scrollbar-thumb': {
          background:  mode('gray.200', 'gray.700')(props),
          borderRadius: '24px',
        }
      }
      
    }),
    
  },
  Divider:{
    baseStyle: props => ({
      borderColor: mode('gray.300', 'gray.700')(props),
      marginTop: '5px',
    }),
  }
};

const theme = extendTheme({styles, components, breakpoints, fonts})

const history = createBrowserHistory();

const App = ()=> {
  return (
    <ChakraProvider theme={theme}>
     <Router history={history}>
        <Switch>
          <Route exact path="/Gallery" component={Gallery}/>
          <Route exact path="/" component={TimeLine}/>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
