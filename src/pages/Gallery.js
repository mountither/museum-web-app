import React from 'react';
import {
  VStack,
  Grid,
  Divider,
  Button
} from '@chakra-ui/react';


import SkeletonCards from "../components/skeletons/SkeletonCards";

import useMuseumData from '../api/museums'

import {
  useLocation,
  useHistory,
  Redirect
} from "react-router-dom";

import AlertContent from '../components/AlertContent';
import GalleryCard from '../components/GalleryCard';

import Heading from '../components/typography/Heading'

// TODO - Implement a Load more feature (pagination)

const Gallery = ()=> {

  const location = useLocation();
  const history = useHistory();

  const {isLoading, data, error} = useMuseumData();

  return (
    <>
    {(location.state == undefined || location.state == null || location.state == '') ? 
    
    <Redirect to='/'/> 
    
    :

    <VStack spacing={10} padding={3}>

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
                main
                marginTop={10} 
                gridArea={'1/1/2/3'} 
                marginLeft={5}  
                title={location.state.title || 'Untitled'} 
              />
               
               <Divider/>

                {error && error.length !== 0
                && <AlertContent errors={error}  zIndex={10} gridArea={'2/2/3/3'}/>}   

                {/* <Text paddingLeft={5} fontSize={{ base:'15px', lg: "25px", md:"25px" }}>
                  {`Results: ${metArtData.length+vamArtData.length+hamArtData.length+aicArtData.length}`}
                </Text> */}

          </Grid>

          {
            isLoading ? <SkeletonCards /> : 
            data['MET']?.map((a, i) =>(
                
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
              isLoading ? <SkeletonCards /> : 
              data['VAM']?.map((a, i) => (
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
          
          isLoading ? <SkeletonCards /> : 
          data['HAM']?.map((a, i) => (
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
            !isLoading &&
            data['SMG']?.map((a, i) => (
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
            !isLoading &&
            data['MVC']?.map((a, i) => (
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
            !isLoading &&
            data['AIC']?.map((a, i) => (
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
