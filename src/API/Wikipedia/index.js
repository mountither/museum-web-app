import React, {useEffect, useReducer} from 'react';

import { reducer } from '../../State/reducer';

import {
  requestStarted,
  requestSuccessful,
  requestFailed,
  requestCancelled,
  setSessionStorage
} from '../../State/actions'

import wiki from 'wikijs';

import fetchSubTopicData from "./fetchSubTopicData";

const useWikiData = ({pageName}) => {

    const [timelineState, dispatch] = useReducer(reducer, {
        isLoading: true,
        data: null,
        error: null,
      });
      
    useEffect(() => {

        //  if TL Data is empty, fetch from wiki api
        if(sessionStorage && sessionStorage.getItem("TLState") != null && sessionStorage.getItem("TLState") != "[]"){
          const LSTLDState = JSON.parse(sessionStorage.getItem('TLState'));
          dispatch(requestSuccessful(LSTLDState));
        }
        else{
  
          // for cancelling wiki api fetch. 
          let isSubscribed = true
  
          const fetchWikiPageContent = async () => {
  
            // init dispatch action 
            dispatch(requestStarted());
  
            try {
  
                const pageResponse = await wiki({
                    apiUrl: 'https://en.wikipedia.org/w/api.php'
                  }).page(pageName)
                    
                const pageContent = await pageResponse.content();
                const filterPageCont = pageContent.filter(c => 
                    (c.title != "See also" 
                    && c.title !== 'References'
                    && c.title !== 'Further reading' 
                    && c.title !== 'External links'
                    && c.title !== 'Classical writers'
                    && c.title !== 'Short outline of Mesopotamia'
                    )
                    );
  
              if(isSubscribed){
      
                // imgs to be appended
                const data = [];
                await filterPageCont.map((c, i) =>{
                  c.items?.map((ci, i) => {
                    if(ci.title == "Early Dynastic period"){
                      ci.title = "Early Dynastic period (Mesopotamia)"
                    }
                    data.push(ci);
                  })
                });
      
                await Promise.all(
                  data.map(async (item) =>{
                  [item.images, 
                    item.dates, 
                    item.dateQuery, 
                    item.nationsToday, 
                    item.majorReligion] = await fetchSubTopicData(item.title);
                  }
                ))
        
                dispatch(requestSuccessful({data}));
                
                try{
                  // store array in session
                  dispatch(setSessionStorage({data}));
                }
                catch(error){
                  console.log('Failed to set data in session storage ', error);
                }
              }
            }
            catch(error){
  
              dispatch(requestFailed({error: "Wiki API failed"}));
  
              console.log(error);
  
            }
          };
  
          fetchWikiPageContent();
  
          return () => {
            dispatch(requestCancelled());
            isSubscribed = false;
            
          }
        }
      }, [pageName])
    
      return timelineState;

}
 
export default useWikiData;