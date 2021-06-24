import wiki from 'wikijs';

import {ExtractRandomElements} from '../../Utils/ArrayHelpers'

import parseDates from "./parseDates";

const fetchSubTopicData = async(title) => {

        // find() searches and returns the first wiki page.
        const searchResponse = await wiki({
          apiUrl: 'https://en.wikipedia.org/w/api.php'
        }).find(title)
        
        const pageImages = await searchResponse.images();
        const pageInfo = await searchResponse.fullInfo();
        const [readDate, queryDate] = parseDates(pageInfo.general, title);
        const currentNations = pageInfo.general?.today?.join(', ') || null;
        const majorReligion = pageInfo.general?.religion || null;
  
        const includeRegex = /\b(jpg|JPG|png)\b/i
        const excludeRegex = /\b(Blank|Blank_space)\b/i
  
        const filteredImageURLs = pageImages.filter(img => {
          return includeRegex.test(img) && !excludeRegex.test(img)
        });
  
        // [images ([]), dates (str), curr nations (str)]
        return [ExtractRandomElements(filteredImageURLs, filteredImageURLs.length < 5 ? 1 : 5), readDate, queryDate, currentNations, majorReligion];
}

export default fetchSubTopicData;