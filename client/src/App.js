import React from 'react';
import {
  ChakraProvider,
  extendTheme ,
  withDefaultColorScheme,
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

const breakpoints = createBreakpoints({
  xs: "350px",
  sm: "450px",
  md: "767px",
  lg: "960px",
  xl: "1200px",
})

const fonts = {
  heading: "Cardo",
  body: "Cardo",
}
const styles = {
  global: props => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.200', '#141214')(props),
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
    }),
  },
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
