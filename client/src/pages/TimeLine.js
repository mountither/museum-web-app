import React, {useEffect, useState} from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

import wiki from 'wikijs';
import { Box, Tag, Text } from '@chakra-ui/react';


const TimeLine =() => {


    const [histData, setHistData] = useState([]);

    useEffect(async () => {
        
        try {
        const pageResponse = await wiki({
            apiUrl: 'https://en.wikipedia.org/w/api.php'
          }).page("History_of_Iraq")
            
        const pageContent = await pageResponse.content();
        const filterPageCont = pageContent.filter(c => 
            (c.title != "See also" && c.title !== 'References' && c.title !== 'Further reading' &&c.title !== 'External links')
            );
        console.log(filterPageCont);


        setHistData(filterPageCont);

        }catch(error){
            console.log(error);
        }
    }, [])


    return (
    <Box marginTop={10} padding={3}>

      <Timeline align='alternate'>

        {histData.map((c,i) => {
            return(
                <TimelineItem key={i}>
                <TimelineOppositeContent>
                    <Tag >{c.content}
                    {
                        c.items && c.items.map((cc,ci) => (<Text key={ci}>{cc.title}</Text>))
                    }
                    </Tag>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{c.title}</TimelineContent>

              </TimelineItem>

            )
        }) 
        }
       
        {/* <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Code</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>Sleep</TimelineContent>
        </TimelineItem> */}
      </Timeline>
      </Box>
    );
  }

  export default TimeLine;