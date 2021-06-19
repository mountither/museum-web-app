import React, {useEffect, useState} from 'react';
import {
  Box,
  Text,
  VStack,
  Grid,
  Divider,
  useColorMode,
  Heading,
  
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

  // useEffect(()=>{
  //   console.log(location);
  //   setPageTitle(location.state.title)
  // },[location])

  const fetchMuseumObjects = async () =>{
   
    // testing potentail parameters
      //const params = {query:'Achaemenid', start: -600, end: -330};
      const params = {query: location.state && location.state.title, start: -7000, end: -1000};
      //const params = {query: 'Mesopotamia', start: -1, end: 1000};
      //const params = {query: 'Iraq', start: -331, end: -140};
     // const params = {query:'Iraq', start: -5000, end: 1400};


      setLoading(true);

      const tempErrorArr = [];
      
      const [METRes, METError] = await getMETResponse(params);

      !METError ? setMETArtData(METRes) : tempErrorArr.push(METError);
      // if(!METError){
      //   setMETArtData(METRes);
      //   sessionStorage.setItem('METData', JSON.stringify(METRes));

      // }
      // else{
      //   tempErrorArr.push(METError);
      // }
      
      const [VAMRes, VAMError] = await getVAMResponse(params);

      !VAMError ? setVAMArtData(VAMRes.data.records) : tempErrorArr.push(VAMError);

      const [HAMRes, HAMError] = await getHAMResponse(params);

      !HAMError ? setHAMArtData(HAMRes.data.records) : tempErrorArr.push(HAMError);

      // const [SMGRes, SMGError] = await getSMGResponse(params);

      // !SMGError ? setSMGArtData(SMGRes.data.data) : tempErrorArr.push(SMGError);

      const [MVCRes, MVCError] = await getMVCResponse(params);

      !MVCError ? setMVCArtData(MVCRes.data) : tempErrorArr.push(MVCError);

      const [AICRes, AICError] = await getAICResponse(params);
      // console.log(AICRes);
      !AICError ? setAICArtData(AICRes) : tempErrorArr.push(AICError);

      //const resSMITH = await axios.get(`https://www.brooklynmuseum.org/api/v2/tags/Mesopotamia`);
      
      // console.log(resSMITH.data.response.rows);

      setErrors(tempErrorArr);

      setLoading(false);

  
  }
  // Metropolitan Museum
  const getMETResponse = async(params)=>{
    try
    {
      // fecth from metro museum
      //const resMET = await axios.get("https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=Iraq&q=fgfhdood&hasImage=true");
      const objectResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${params.query}&hasImage=true`);
      
      const response = [];
      const resMETCount = objectResponse.data.total > 10 ? 10 : objectResponse.data.total;

      for(let i=0; i < resMETCount; i++){
        const resEach = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectResponse.data.objectIDs[i]}`);
        if(resEach.data.objectBeginDate >= params.start && resEach.data.objectEndDate <= params.end){
          response.push(resEach.data);
        }
      }
      console.log("Count in MET: (10 shown) ", objectResponse.data.total);

      //data, error
      return [response, null];
    }
    catch(error)
    {
      console.log(error);
      return [null, 'Metro Museum'];
    }
      
  }
  // victoria and albert museum 
  const getVAMResponse = async(params)=>{

    try{

      // fetch from victoria and albert museum 
      const response = await axios.get(`https://api.vam.ac.uk/v2/objects/search?q=${params.query}&images_exist=true&year_made_from=${params.start}&year_made_to=${params.end}`);
      
      console.log("Count in VAM:  ", response.data.info.record_count);

      return [response, null];
    }
    catch(error){
      console.log(error);

      return [null, 'Victoria and Albert Museum']
    }
  }

  // harvard art museums
  const getHAMResponse = async(params)=>{

    try{

      // fetch from harvard arts museum
      const response = await axios.get(`https://api.harvardartmuseums.org/object?q=${params.query}&hasimage=1&sort=random&apikey=${process.env.REACT_APP_HAM_API_KEY}`);
      console.log("Count in HAM: (10 shown) ", response.data.info.totalrecords);
      return [response, null];

    }
    catch(error){

      console.log(error);
      
      return [null, 'Havard Arts Museum']
    }
  }

  // science museum group
  const getSMGResponse = async(params)=>{
    try
    { 
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
      
      const url = `https://collection.sciencemuseumgroup.org.uk/search/images?q=${params.query}`;

      const response = await axios.get(url, {headers});

      console.log(response.data.data);
      console.log("Count in SMG: ", response.data.meta.count.type.all);

      // response.data.data.map((item) => console.log(item.attributes?.lifecycle?.creation[0].date));

      return [response, null]
    }
    catch(error)
    {
      console.log(error);

      return [null, 'Science Museum Group']

    }
  }

  // museum victoria collection
  const getMVCResponse = async(params)=>{
    try
    { 
      const limit = 20;

      const url = `https://collections.museumsvictoria.com.au/api/search?query=${params.query}&hasimages=yes&perpage=${limit}&locality=iraq`;

      const response = await axios.get(url);

      console.log(response);
      console.log("Count in MVC: ", response.data.length);

      // response.data.data.map((item) => console.log(item.attributes?.lifecycle?.creation[0].date));

      return [response, null]
    }
    catch(error)
    {
      console.log(error);

      return [null, 'Museum Victoria']

    }
  }
  
  // Art Institute of Chicago 
  const getAICResponse = async(params)=>{
    try
    { 
      const url = `https://api.artic.edu/api/v1/artworks/search?q=${params.query}`;

      const shallowRes = await axios.get(url);
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
      console.log(error);

      return [null, 'Art Institute of Chicago']

    }
  }

  useEffect(() =>{
    window.scrollTo(0,0);

    // if(sessionStorage.getItem("METData") != null && sessionStorage.getItem("METData") != "[]"){
    //   const METData = JSON.parse(sessionStorage.getItem('METData'));
    //   setMETArtData(METData);
    //   setLoading(false);
    // }
    // else{
      fetchMuseumObjects();

    // }
    

  }, [])

  return (
    <>
    {(location.state == undefined || location.state == null || location.state == '') ? 
    
    <Redirect to='/'/> :

    <VStack spacing={10} padding={3}>
      
      <Box pos='absolute' left="0px">
        <ColorModeSwitcher />
      </Box>
         <Link to='/' ><Text fontWeight='semibold' fontSize='15px' _hover={{textDecoration: 'underline'}} textUnderlineOffset='2px'>Home</Text></Link>
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
               >{location.state.title}<Divider/></Heading>

                <AlertContent errors={errors} />   
  
          </Grid>

          {
            loading ? <SkeletonCards /> : 
              metArtData?.map((a, i) =>(
                
                <GalleryCard 
                  key={i} 
                  title={a.title} 
                  imgURL={a.primaryImageSmall}
                  dateCreation={a.objectDate}
                  region={a.subregion} 
                  restPayload={[
                    a.culture && {type: 'Culture', data:a.culture}
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
