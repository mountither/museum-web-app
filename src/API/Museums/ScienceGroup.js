import axios from 'axios';

const FetchSMGData = async(params, source)=>{
  const APIName = "SMG"  
  try
    { 
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
      
      const url = `https://collection.sciencemuseumgroup.org.uk/search/images/places/mesopotamia?q=${params.query}&random=10`;

      const response = await axios.get(url, {headers, cancelToken: source.token});

      console.log("Count in SMG: ", response.data.meta.count.type.all);

      return [APIName, response.data.data]
    }
    catch(error)
    {
      if(axios.isCancel(error)){
        throw 'Fetch Canceled @ SMG';
      }
      else{
        throw 'Science Museum Group';
      }
    }
}

export default FetchSMGData;