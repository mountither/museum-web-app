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
  useLocation,
  useHistory,
  Redirect
} from "react-router-dom";

import AlertContent from '../components/AlertContent';
import GalleryCard from '../components/GalleryCard';

import { METData,VAMData, HAMData, AICData } from "../api/museums";
// TODO - Implement a Load more feature (pagination)

const Gallery = ()=> {

  const [metArtData, setMETArtData] = useState([]);
  const [vamArtData, setVAMArtData] = useState([]);
  const [hamArtData, setHAMArtData] =useState([]);
  const [aicArtData, setAICArtData] = useState([]);
  const [smgArtData, setSMGArtData] = useState([]);
  const [mvcArtData, setMVCArtData] = useState([]);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const history = useHistory();

  const fetchMuseumObjects = async (source) =>{
      //* location state holds the query title and years. 
      // const time1 = Date.now();
      // testing potentail parameters
      //const params = {query:'Achaemenid', start: -600, end: -330};
      //const params = {query: 'Mesopotamia', start: -1, end: 1000};
      const params = {query: location?.state?.title, start: parseInt(location?.state?.startPeriod) || '-5000', end: parseInt(location?.state?.endPeriod) || '1950'};

      setLoading(true);

      const errorSet = [];
      
      const [METRes, METError] = await METData(params, source);
      !METError ? setMETArtData(METRes) : errorSet.push(METError);
     
      const [VAMRes, VAMError] = await VAMData(params, source);
      !VAMError ? setVAMArtData(VAMRes) : errorSet.push(VAMError);

      const [HAMRes, HAMError] = await HAMData(params, source);
      !HAMError ? setHAMArtData(HAMRes) : errorSet.push(HAMError);
      
      const [AICRes, AICError] = await AICData(params, source);
      !AICError ? setAICArtData(AICRes) : errorSet.push(AICError);

      // not used
      // const [SMGRes, SMGError] = await getSMGResponse(params, source);
      // !SMGError ? setSMGArtData(SMGRes.data.data) : errorSet.push(SMGError);
      
      // not used
      // const [MVCRes, MVCError] = await getMVCResponse(params, source);
      // !MVCError ? setMVCArtData(MVCRes.data) : errorSet.push(MVCError);
      
      //const resSMITH = await axios.get(`https://www.brooklynmuseum.org/api/v2/tags/Mesopotamia`);
      
      // console.log(resSMITH.data.response.rows);
      // const time2 = Date.now();
      // console.log(time2- time1);

      setErrors(errorSet);
      setLoading(false);
  }
  useEffect(() =>{
    let source = axios.CancelToken.source();

    window.scrollTo(0,0);

    fetchMuseumObjects(source);

    return () => {
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
              marginLeft={5} 
              fontWeight="hairline" 
              textTransform='capitalize'
               >{location.state.title || 'Untitled'}<Divider/></Heading>

                <AlertContent errors={errors}  zIndex={10} gridArea={'2/2/3/3'}/>   

                {/* <Text paddingLeft={5} fontSize={{ base:'15px', lg: "25px", md:"25px" }}>
                  {`Results: ${metArtData.length+vamArtData.length+hamArtData.length+aicArtData.length}`}
                </Text> */}

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
                  title={a?.displayTitle} 
                  imgURL={a?.media[0]?.large?.uri}
                  dateCreation={a?.associations[0]?.date}
                  region={a?.associations[0]?.country}
                />

              ))
          }

          {
            !loading &&
              aicArtData?.map((a, i) => (
                <GalleryCard 
                  key={i} 
                  title={a.title} 
                  imgURL={a.image_id && `https://www.artic.edu/iiif/2/${a.image_id}/full/843,/0/default.jpg`}
                  dateCreation={a.date_display}
                  region={a.place_of_origin}
                  restPayload={[
                    a.medium_display &&  {type: 'Type', data: a.medium_display},
                    a.artist_display && {type: 'Creator', data: a.artist_display},
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
