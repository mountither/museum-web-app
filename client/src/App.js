import React from 'react';
import {
  ChakraProvider,
  extendTheme 
} from '@chakra-ui/react';
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


const breakpoints = createBreakpoints({
  sm: "400px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
})

const fonts = {
  heading: "Raleway",
  body: "Raleway",
}

const theme = extendTheme({ breakpoints, fonts})

const history = createBrowserHistory();

const App = ()=> {
  return (
    <ChakraProvider theme={theme}>
     <Router history={history}>
        <Switch>
          <Route path="/Gallery" component={Gallery}/>
          <Route path="/" component={TimeLine}/>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
