import React, {useEffect, useState} from 'react';
import {
  Box,
  Text,
  VStack,
  Grid,
  Divider,
  useColorMode,
  Heading,
  Button
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';

import axios from 'axios';

import SkeletonCards from "../components/Skeletons/SkeletonCards";

import {
  Link,
  useLocation,
  useHistory,
  Redirect
} from "react-router-dom";

import AlertContent from '../components/AlertContent';
import GalleryCard from '../components/GalleryCard';
import {HAMApiCenturyFromYear} from '../utils/DateHelpers';

// TODO - Implement a Load more feature (pagination)

const Gallery = ()=> {

  const [metArtData, setMETArtData] = useState([]);
  const [vamArtData, setVAMArtData] = useState([]);
  const [hamArtData, setHAMArtData] =useState([]);
  const [smgArtData, setSMGArtData] = useState([]);
  const [mvcArtData, setMVCArtData] = useState([]);
  const [aicArtData, setAICArtData] = useState([]);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('');

  const { colorMode } = useColorMode()
  
  // used for the alert box.

  const location = useLocation();
  const history = useHistory();
  // useEffect(()=>{
  //   console.log(location);
  //   setPageTitle(location.state.title)
  // },[location])

  const fetchMuseumObjects = async (source) =>{
      const time1 = Date.now();
      //* location state holds the query title and years. 

    // testing potentail parameters
      //const params = {query:'Achaemenid', start: -600, end: -330};
      //const params = {query: 'Mesopotamia', start: -1, end: 1000};
    console.log(location.state.startPeriod , location.state.endPeriod );
      const params = {query: location.state.title, start: location.state.startPeriod || '-5000', end: location.state.endPeriod || '1950'};

      setLoading(true);

      const errorSet = [];
      
      const [METRes, METError] = await getMETResponse(params, source);
      !METError ? setMETArtData(METRes) : errorSet.push(METError);
     
      const [VAMRes, VAMError] = await getVAMResponse(params, source);
      !VAMError ? setVAMArtData(VAMRes.data.records) : errorSet.push(VAMError);

      const [HAMRes, HAMError] = await getHAMResponse(params, source);
      !HAMError ? setHAMArtData(HAMRes) : errorSet.push(HAMError);

      // not used
      // const [SMGRes, SMGError] = await getSMGResponse(params, source);
      // !SMGError ? setSMGArtData(SMGRes.data.data) : errorSet.push(SMGError);

      // const [MVCRes, MVCError] = await getMVCResponse(params, source);
      // !MVCError ? setMVCArtData(MVCRes.data) : errorSet.push(MVCError);

      // const [AICRes, AICError] = await getAICResponse(params, source);
      // !AICError ? setAICArtData(AICRes) : errorSet.push(AICError);

      //const resSMITH = await axios.get(`https://www.brooklynmuseum.org/api/v2/tags/Mesopotamia`);
      
      // console.log(resSMITH.data.response.rows);

      setErrors(errorSet);
      console.log(errorSet);
      setLoading(false);
      const time2 = Date.now();
      console.log(time2-time1);
  }

  // Metropolitan Museum
  const getMETResponse = async(params, source)=>{
    try
    {
      // fecth from metro museum
      //const resMET = await axios.get("https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=Iraq&q=fgfhdood&hasImage=true");
      const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${params.query}&hasImage=true&limit=5`;
      const objectResponse = await axios.get(url, {
        cancelToken: source.token
      });
      
      const resMETCount = objectResponse.data.total > 10 ? 10 : objectResponse.data.total;

      const response = [];
      if(objectResponse.data.total > 0){
        await Promise.all(
          objectResponse.data?.objectIDs?.slice(0, resMETCount).map( async (t, i) => {
          const itemUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${t}`
          const resEach = await axios.get(itemUrl, {
            cancelToken: source.token
          });
  
          if(resEach.data.objectBeginDate >= params.start && resEach.data.objectBeginDate <= params.end){
            response.push(resEach.data)
          }
  
          }));
      }

      console.log("Count in MET: (10 shown) ", objectResponse.data.total);

      //data, error
      return [response, null];
    }
    catch(error)
    {
      if(axios.isCancel(error)){
        return [null, 'Fetch Canceled @ MET'];
      }
      else{
        console.log(error);
        return [null, 'Metro Museum'];
      }
    }
      
  }
  // victoria and albert museum 
  const getVAMResponse = async(params, source)=>{

    try{

      // fetch from victoria and albert museum
      // const url = `https://api.vam.ac.uk/v2/objects/search?q=${params.query}&images_exist=true&year_made_from=${params.start}&year_made_to=${params.end}`
      const url = `https://api.vam.ac.uk/v2/objects/search?q_place_name=mesopotamia|iraq|turkey|iran|syria&year_made_from=${params.start}&year_made_to=${params.end}&images_exist=1&random=1`
      const response = await axios.get(url, {
        cancelToken: source.token
      });
      
      console.log("Count in VAM:  ", response.data.info.record_count);
      return [response, null];
    }
    catch(error){
      if(axios.isCancel(error)){
        return [null, 'Fetch Canceled @ VAM'];
      }
      else{
        return [null, 'Victoria and Albert Museum']
      }
    }
  }

  // harvard art museums
  const getHAMResponse = async(params, source)=>{

    try{

      // fetch from harvard arts museum
      const limit = 10;
      const page= '1';

      // all Middle east
      const placeID = 2028350;
      const centuries = HAMApiCenturyFromYear(params.start, params.end).join('|');
      console.log(centuries);
      const url = `https://api.harvardartmuseums.org/object?q=*&hasimage=1&size=${limit}&place=${placeID}&century=${centuries}&apikey=${process.env.REACT_APP_HAM_API_KEY}`
      const response = await axios.get(url, {
        cancelToken: source.token
      });

      console.log("Count in HAM: (10 shown) ", response.data.info.totalrecords);
      
      return [response.data.records, null];
    }
    catch(error){
      if(axios.isCancel(error)){
        return [null, 'Fetch Canceled @ HAM'];
      }
      else{
        return [null, 'Havard Arts Museum']
      }
    }
  }

  // science museum group (inactive)
  // const getSMGResponse = async(params, source)=>{
  //   try
  //   { 
  //     const headers = {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     }
      
  //     const url = `https://collection.sciencemuseumgroup.org.uk/search/images/places/mesopotamia?q=${params.query}&random=10`;

  //     const response = await axios.get(url, {headers, cancelToken: source.token});

  //     console.log(response);
  //     console.log("Count in SMG: ", response.data.meta.count.type.all);

  //     // response.data.data.map((item) => console.log(item.attributes?.lifecycle?.creation[0].date));

  //     return [response, null]
  //   }
  //   catch(error)
  //   {
  //     if(axios.isCancel(error)){
  //       return [null, 'Fetch Canceled @ SMG'];
  //     }
  //     else{
  //       return [null, 'Science Museum Group']
  //     }
  //   }
  // }

  // museum victoria collection
  const getMVCResponse = async(params, source)=>{
    try
    { 
      const limit = 20;

      const url = `https://collections.museumsvictoria.com.au/api/search?query=${params.query}&hasimages=yes&perpage=${limit}&locality=iraq`;

      const response = await axios.get(url, {
        cancelToken: source.token
      });

      console.log(response);
      console.log("Count in MVC: ", response.data.length);

      // response.data.data.map((item) => console.log(item.attributes?.lifecycle?.creation[0].date));

      return [response, null]
    }
    catch(error)
    {
      if(axios.isCancel(error)){
        return [null, 'Fetch Canceled @ MVC'];
      }
      else{
        return [null, 'Museum Victoria']
      }
    }
  }
  
  // Art Institute of Chicago 
  const getAICResponse = async(params, source)=>{
    try
    { 
      const url = `https://api.artic.edu/api/v1/artworks/search?q=${params.query}`;

      const shallowRes = await axios.get(url, {
        cancelToken: source.token
      });
      const response = [];
      for(let i=0; i < shallowRes.data.data.length; i++){
        const resEach = await axios.get(`https://api.artic.edu/api/v1/artworks/${shallowRes.data.data[i].id}`);
        response.push(resEach.data);
        
      }


      console.log("Count in AIC: (shown 10)", shallowRes.data.pagination.total);

      // response.data.data.map((item) => console.log(item.attributes?.lifecycle?.creation[0].date));

      return [response, null]
    }
    catch(error)
    {
      if(axios.isCancel(error)){
        return [null, 'Fetch Canceled @ AIC'];
      }
      else{
        return [null, 'Art Institute of Chicago']
      }
    }
  }

  useEffect(() =>{

    let source = axios.CancelToken.source();
    window.scrollTo(0,0);

    // if(sessionStorage.getItem("METData") != null && sessionStorage.getItem("METData") != "[]"){
    //   const METData = JSON.parse(sessionStorage.getItem('METData'));
    //   setMETArtData(METData);
    //   setLoading(false);
    // }
    // else{
    fetchMuseumObjects(source);
    // }
    return () => {
      console.log("cleanup @ gallery");
      setLoading(false);
      source.cancel();
    }

  }, [])


  return (
    <>
    {(location.state == undefined || location.state == null || location.state == '') ? 
    
    <Redirect to='/'/> :

    <VStack spacing={10} padding={3}>
      
      <Box pos='absolute' left="0px">
        <ColorModeSwitcher />
      </Box>

           <Button fontWeight='semibold' fontSize='15px'
           variant='link'
           onClick={()=> history.goBack()}
            >
             Back
             </Button>

          <Grid
                templateRows="1fr 0.2fr"
                templateColumns="1fr 1fr"
                gridAutoFlow='dense'
                gap={0}>
            
              <Heading 
       
              marginTop={10} 
              gridArea={'1/1/2/3'} 
              fontSize={{lg:'9xl', base:'5xl'}} 
              marginLeft={3} 
              fontWeight="hairline" 
              textTransform='capitalize'
               >{location.state.title || 'Untitled'}<Divider/></Heading>

                <AlertContent errors={errors}  zIndex={10} gridArea={'2/2/3/3'}/>   
          </Grid>

          {
            loading ? <SkeletonCards /> : 
              metArtData?.map((a, i) =>(
                
                <GalleryCard 
                  key={i} 
                  title={a.title} 
                  imgURL={a.primaryImageSmall}
                  dateCreation={a.objectDate}
                  region={a.region} 
                  restPayload={[
                    a.culture && {type: 'Culture', data:a.culture},
                    a.medium && {type: 'Type', data:a.medium},
                    a.period && {type: 'Period', data:a.period}
                  ]}
                />

            ))
            }

            {
              loading ? <SkeletonCards /> : 
                vamArtData?.map((a, i) => (
                  <GalleryCard 
                    key={i} 
                    title={a._primaryTitle ? a._primaryDate :a.objectType} 
                    imgURL={`https://framemark.vam.ac.uk/collections/${a._primaryImageId}/full/735,/0/default.jpg`}
                    dateCreation={a._primaryDate}
                    region={a._primaryPlace} 
                    restPayload={[
                      a.objectType && {type: 'Type', data:a.objectType}
                    ]}
                  />


                ))
            }

          {
          
            loading ? <SkeletonCards /> : 
              hamArtData?.map((a, i) => (
                <GalleryCard 
                  key={i} 
                  title={a.title} 
                  imgURL={a.primaryimageurl}
                  dateCreation={a.dated}
                  restPayload={[
                    a.classification && {type: 'Classification', data:a.classification},
                    a.culture && {type: 'Culture', data: a.culture}           
                  ]}
                />

              ))
          }

          
          {
            !loading &&
              smgArtData?.map((a, i) => (
                <GalleryCard 
                  key={i} 
                  title={a.attributes.summary_title} 
                  imgURL={`https://coimages.sciencemuseumgroup.org.uk/images/${a.attributes.multimedia[0]?.processed.large.location}`}
                  dateCreation={(a.attributes.lifecycle?.creation?.date) && a.attributes.lifecycle.creation[0].date[0].value}
                  restPayload={[
                    a.attributes.categories && {type: 'Category', data: a.attributes.categories[0].name}
                  ]}
                />

              ))
          }

          {
            !loading &&
              mvcArtData?.map((a, i) => (
                <GalleryCard 
                  key={i} 
                  title={a.displayTitle} 
                  imgURL={a.media[0].large.uri}
                  dateCreation={a.associations[0].date}
                  region={a.associations[0].country}
                />

              ))
          }

          {
            !loading &&
              aicArtData?.map((a, i) => (
                <GalleryCard 
                  key={i} 
                  title={a.data.title} 
                  imgURL={`https://www.artic.edu/iiif/2/${a.data.image_id}/full/843,/0/default.jpg`}
                  dateCreation={a.data.date_display}
                  region={a.data.place_of_origin}
                  restPayload={[
                    a.data.medium_display &&  {type: 'Type', data: a.data.medium_display},
                    a.data.artist_display && {type: 'Creator', data: a.data.artist_display},
                  ]}
                />

              ))
          }
       
          </VStack>
        }
        </>
  );
}

export default Gallery;
