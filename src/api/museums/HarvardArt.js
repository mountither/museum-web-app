import axios from 'axios';
import {CenturyFromYear, MillenniumFromYear} from '../../Utils/DateHelpers/HAMApiDateParser';

const FetchHAMData = async(params, source)=>{
  const APIName = 'HAM'
    try{

      // fetch from harvard arts museum
      const limit = 10;
      const page= 1;

      // const placeID1 = 2028350;
      // const placeID2 = 2028220;
      const cultures = {
        1:  'Mesopotamian',
        2:  'Sumerian',
        3:  'Akkadian',
        4:  'Uruk',
      };

      const periods = params.end > -2004 ? CenturyFromYear(params.start, params.end).join('|') : MillenniumFromYear(params.start, params.end).join('|');

      const url = `https://api.harvardartmuseums.org/object?q=*&hasimage=1&size=${limit}&sort=random&culture=${cultures[1]}|${cultures[2]}|${cultures[3]}|${cultures[4]}&century=${periods}&apikey=${process.env.REACT_APP_HAM_API_KEY}`
      const response = await axios.get(url, {
        cancelToken: source.token
      });

      console.log("Count in HAM: (10 shown) ", response.data.info.totalrecords);
      
      return [APIName, response.data.records];
    }
    catch(error){
      if(axios.isCancel(error)){
        throw 'Fetch Canceled @ HAM';
      }
      else{
        throw 'Havard Arts Museum';
      }
    }
}

export default FetchHAMData;