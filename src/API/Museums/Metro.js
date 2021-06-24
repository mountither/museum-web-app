import axios from 'axios';

const FetchMETData = async(params, source)=>{
    const APIName = "MET";
    try
    {
      const keywords = 'period'
      // fecth from metro museum
      const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${params.query}+${keywords}&hasImage=true&limit=5`;
      const objectResponse = await axios.get(url, {
        cancelToken: source.token
      });
      
      const resMETCount = objectResponse.data.total > 10 ? 10 : objectResponse.data.total;
      console.log(params.start, params.end)
      const response = [];
      if(objectResponse.data.total > 0){
        await Promise.all(
          objectResponse.data?.objectIDs?.slice(0, resMETCount).map( async (t, i) => {
            
          const itemUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${t}`
          const res = await axios.get(itemUrl, {
            cancelToken: source.token
          });

          if(res.data.objectBeginDate >= params.start && res.data.objectBeginDate <= params.end){
            response.push(res.data)
          }
  
          }));
      }
      console.log("Count in MET: (10 shown - wo/date check) ", objectResponse.data.total);

      //name, data, error
      return [APIName,response];
    }
    catch(error)
    {
      if(axios.isCancel(error)){
        throw 'Fetch Canceled @ MET';
      }
      else{
        throw 'Metro Museum';
      }
    }
      
}

export default FetchMETData;