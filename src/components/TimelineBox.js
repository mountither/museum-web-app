import React, {useState} from 'react'
import { Box, 
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';

import TimelineDrawer from './TimelineDrawer';

const TimelineBox = ({data, children}) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [drawerData, setDrawerData] = useState({});
    const [isLargerThan1280] = useMediaQuery("(min-width: 960px)");

    const onOpenDrawer = (dataObject)=>{
      onOpen();
      setDrawerData({
        title: dataObject.title, 
        content: dataObject.mainContent, 
        subContents: dataObject.items || null, 
        images: dataObject.imageSet || null,
        dates: dataObject.dates
      });

    }

    return ( 
        <>
        <Box
            onClick={() =>
                onOpenDrawer({
                title: data.title, 
                mainContent: data.content, 
                items: data.items &&data.items, 
                imageSet: data.images && data.images,
                dates: data.dateQuery
                })
            }
            maxWidth='4xl'
            width={!isLargerThan1280 && '40vw'}
            cursor='pointer'
            align='center'
        >
            {children}
        </Box>
        {isOpen && 
        <>
           <TimelineDrawer  drawerData={drawerData} onClose={onClose}/>
        </>
        }
    </>
     );
}
 
export default TimelineBox;