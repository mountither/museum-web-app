import axios from 'axios';

const FetchMVCData = async(params, source)=>{
  const APIName = 'MVC'
  try
  { 
    const limit = 10;
    const category = 'history+%26+technology';
    const itemType = 'image';
    const collectingAreas = {
      1:  'museum+history',
      2:  'historical+archaeology',
    }
    const url = `https://collections.museumsvictoria.com.au/api/search?query=*&sort=random&hasimages=yes&category=${category}&collectingarea=${collectingAreas[1]}&collectingarea=${collectingAreas[2]}&itemtype=${itemType}&perpage=${limit}`;

    const response = await axios.get(url, {
      cancelToken: source.token
    });

    console.log("Count in MVC: (10 shown) ", response.headers['total-results']);

    return [APIName, response.data]
  }
  catch(error)
  {
    if(axios.isCancel(error)){
      throw 'Fetch Canceled @ MVC';
    }
    else{
      throw 'Museum Victoria';
    }
  }
}

export default FetchMVCData;