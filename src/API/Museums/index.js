import {useEffect, useReducer} from 'react';

import axios from 'axios';

import { reducer } from '../../State/reducer';

import METData from "./Metro";
import VAMData from "./VicAlbert";
import HAMData from "./HarvardArt";
import AICData from "./ArtsInstChicago";

import {
    useLocation,
  } from "react-router-dom";
  
import {
  requestStarted,
  requestSuccessful,
  requestFailed,
  requestCancelled,
} from '../../State/actions'


const useMuseumData = () => {

    const [museumState, dispatch] = useReducer(reducer, {
        isLoading: true,
        data: null,
        error: null,
      });

    const location = useLocation();
      
    const fetchMuseumObjects = async (source) =>{
        dispatch(requestStarted());
    
        try{
          //* location state holds the query title and years. 
        //   const time1 = Date.now();
          // testing potentail parameters
    
          const params = {query: location?.state?.title, start: parseInt(location?.state?.startPeriod) || '-5000', end: parseInt(location?.state?.endPeriod) || '1950'};
    
          const errorSet = [];
          const dataSet = {};
    
          const METCall = METData(params, source);
          const HAMCall = HAMData(params, source);
          const VAMCall = VAMData(params, source);
          const AICCall = AICData(params, source);
          
          const promiseAPIs =  await Promise.allSettled([METCall, HAMCall, VAMCall, AICCall])
    
          promiseAPIs.forEach((response) => {
                if (response.status === 'fulfilled'){
                  const [id, data] = response.value;
                  dataSet[id] = data;
                }
                else if(response.status === 'rejected'){
                  const message = response.reason;
                  errorSet.push(message)
                }
          });
          dispatch(requestSuccessful({data: dataSet}));
    
         if(errorSet.length > 0){
           dispatch(requestFailed({error: errorSet}));
         }

          //const resSMITH = await axios.get(`https://www.brooklynmuseum.org/api/v2/tags/Mesopotamia`);
          
          // console.log(resSMITH.data.response.rows);
    
        //   const time2 = Date.now();
        //   console.log(time2- time1);
    
        }
        catch(error){
          console.log("error @ museum: ", error)
        }
      }

    
    useEffect(() =>{
        let source = axios.CancelToken.source();

        window.scrollTo(0,0);

        fetchMuseumObjects(source);

        return () => {
        dispatch(requestCancelled());
        source.cancel();
        }

    }, [location.state])


    return museumState;

}

export default useMuseumData;