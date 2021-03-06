import axios from 'axios';

const FetchAICData = async(params, source)=>{
    const APIName = "AIC";
    try
    { 
      const limit = 5;
      const fields = ['id','title','image_id','date_start','date_end','date_display','place_of_origin','medium_display','artist_display']
      const origin = ['mesopotamia','syria', 'iran', 'iraq','arabian peninsula', 'middle east']

      const url = `https://api.artic.edu/api/v1/artworks/search`;
      //elastic search
      const data = {
        "size": limit,
        "fields": fields,
        "query": {
          "bool": {
            "filter": [
              {
                "terms": {
                  "place_of_origin": origin
                }
              },
              {
                "range": {
                  "date_start": {
                    "gte": params.start,
                    "lte":params.end
                  }
                }
              }
            ]
          }
        }
      }

      const options = {
        method: 'post',
        url,
        data,
        cancelToken: source.token
      };

      const response = await axios(options);

      console.log("Count in AIC: (shown 10)", response.data.pagination.total);

      return [APIName, response.data.data]

    }
    catch(error)
    {
      if(axios.isCancel(error)){
        throw 'Fetch Canceled @ AIC';
      }
      else{
        // return [APIName, null, 'Art Institute of Chicago']
        throw "Art Institute of Chicago";
      }
    }
  }

  export default FetchAICData;