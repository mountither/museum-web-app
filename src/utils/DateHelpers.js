import React from 'react';


export const HAMApiCenturyFromYear = (yearStart, yearEnd) => {

    // must return string in format: e.g: 14th century BCE 
    
    // convert to century while perserving negetive/pos for century type
    const startCentury = convertAndPreserveSign(yearStart)
    const endCentury = convertAndPreserveSign(yearEnd);

    const centuries = [];

    const minCentury = Math.min(startCentury, endCentury);
    const maxCentury = Math.max(startCentury, endCentury);
    
    for(let i = minCentury; i <= maxCentury; i++)
    {
        if(i == 0){
            continue;
        }
        
        centuries.push(`${Math.abs(i)}${nth(Math.abs(i))} century${centuryType(i)}`);
       
    }
    return centuries;
}


const nth = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
}

const centuryType = (d) =>{
    if(Math.sign(d) == -1){
        return " BCE"
    }
    else if(d > 0  && d < 6){
        // 1-4 centuries CE include CE at end (HAM filtering inconsistency)
        return ' CE'
    }

    return '';
}

const convertAndPreserveSign = (year) =>{
    return Math.sign(year) == -1 ?
    (-Math.abs(Math.floor((Math.abs(year) - 1) / 100) + 1)) : (Math.floor((Math.abs(year) - 1) / 100) + 1);
}