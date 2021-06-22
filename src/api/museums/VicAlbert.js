import axios from 'axios';

const FetchVAMData = async(params, source)=>{

    try{
      // fetch from victoria and albert museum
      const limit = 10;
      const todayPlaces = 'mesopotamia|iraq|turkey|iran|syria'
      const url = `https://api.vam.ac.uk/v2/objects/search?q_place_name=${todayPlaces}&year_made_from=${params.start}&year_made_to=${params.end}&page_size=${limit}&images_exist=1&random=1`
      const response = await axios.get(url, {
        cancelToken: source.token
      });
      
      console.log("Count in VAM:  ", response.data.info.record_count);
      return [response.data.records, null];
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

export default FetchVAMData;