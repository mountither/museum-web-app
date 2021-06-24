   
    // generalInfo object includes differing fields that represent the date period.
const parseDates = (dataObj, periodName) => {
  
        //* potential date fields: 
        // yearStart/yearEnd, dates, lifeSpan
        // lifeSpan should take precendence. Followed by yearStart/End and finally dates.
        // yearStart/End + lifeSpan must include digits. 
  
        const containsDigits = /\d/;
        // intention: start/end in object -> match[0], match[1]
        const extractDigits = /([0-9,]+)/g;
  
        var readableDates = '';
        var queryableDate = {start: '', end: ''};
  
        if(dataObj.lifeSpan && containsDigits.test(dataObj.lifeSpan)){
          readableDates =  dataObj.lifeSpan;
        }
        else if(dataObj.yearStart && dataObj.yearEnd 
                && containsDigits.test(dataObj.yearStart)
                && containsDigits.test(dataObj.yearEnd)){
          
          readableDates = dataObj.yearStart + ' - ' + dataObj.yearEnd;
        }
        else if(dataObj.dates && containsDigits.test(dataObj.dates)){
          readableDates = dataObj.dates;
        }
        else{
          // check specific periods and allocate manually.
          switch (periodName) {
            case "Pre-Pottery Neolithic":
              readableDates = "c. 10,000 — 6,500 BCE";
              break;
            case "Chalcolithic period":
              readableDates = "c. 6000 - 3300 BCE";
              break;
            case "Early Dynastic period (Mesopotamia)":
              readableDates = "c. 2900 – 2350 BCE";
              break;
            case "Akkadian Empire":
              readableDates = "c. 2334 – 2154 BCE";
              break;
            case "Hurrians":
              readableDates = "c. 1600 - c. 1000 BCE";
              break;
            case "Bronze Age collapse":
              readableDates = "c. 1200 - 1150 BCE";
              break;
            case "Classical Antiquity to Late Antiquity":
              readableDates = "c. 539 BCE - 800 CE";
              break;
            default:
              break;
          }
        }
  
        const dateSet = readableDates.match(extractDigits);
        var dash = true;
  
        // CE
        if(periodName == "Classical Antiquity to Late Antiquity"){
          dash = false
        }
        
        if(dateSet){
          queryableDate = {start: `-${dateSet[0]?.replace(/,/g, '')}`, end: `${dash ? '-' : ''}${dateSet[1]?.replace(/,/g, '')}`}
        }
        else{
          queryableDate = {start: null, end: null};
        }
  
        return [readableDates, queryableDate]
  
}

export default parseDates;
