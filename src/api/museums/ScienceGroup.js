import axios from 'axios';

const FetchSMGData = async(params, source)=>{
    try
    { 
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
      
      const url = `https://collection.sciencemuseumgroup.org.uk/search/images/places/mesopotamia?q=${params.query}&random=10`;

      const response = await axios.get(url, {headers, cancelToken: source.token});

      console.log("Count in SMG: ", response.data.meta.count.type.all);

      return [response.data.data, null]
    }
    catch(error)
    {
      if(axios.isCancel(error)){
        return [null, 'Fetch Canceled @ SMG'];
      }
      else{
        return [null, 'Science Museum Group']
      }
    }
}

export default FetchSMGData;