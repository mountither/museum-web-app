
export const CenturyFromYear = (yearStart, yearEnd) => {

    // must return string in format: e.g: 14th century BCE 
    // convert to century while perserving negetive/pos for century type
    const startCentury = extractRawCentury(yearStart)
    const endCentury = extractRawCentury(yearEnd);

    const centuries = [];
    const minCentury = Math.min(startCentury, endCentury);
    const maxCentury = Math.max(startCentury, endCentury);
    
    for(let i = minCentury; i <= maxCentury; i++)
    {
        if(i === 0){
            continue;
        }
       
        centuries.push(`${Math.abs(i)}${nth(Math.abs(i))} century${periodType(i)}`);

    }

    return centuries;
}

export const MillenniumFromYear = (yearStart, yearEnd) => {
    // case: ~ 10000 - 6000 BCE are considered apart of 6th millennium. 

    const startMillennium = extarctRawMillennium(yearStart);
    const endMillennium = extarctRawMillennium(yearEnd)

    const millennia = [];
    const minMillennium = Math.min(startMillennium, endMillennium);
    const maxMillennium = Math.max(startMillennium, endMillennium);
    
    for(let i = minMillennium; i <= maxMillennium; i++)
    {
        if(i === 0){
            continue;
        }
       
        millennia.push(`${Math.abs(i)}${nth(Math.abs(i))} millennium${periodType(i)}`);

    }

    return millennia;

}

// helpers for above

const nth = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
}

const periodType = (d) =>{
    if(Math.sign(d) === -1){
        return " BCE"
    }
    else if(d > 0  && d < 6){
        // 1-4 centuries CE include CE at end (HAM filtering inconsistency)
        return ' CE'
    }

    return '';
}

const extractRawCentury = (year) =>{
    return Math.sign(year) === -1 ?
    (-Math.abs(Math.floor((Math.abs(year) - 1) / 100) + 1)) : (Math.floor((Math.abs(year) - 1) / 100) + 1);
}

const extarctRawMillennium = (year) =>{
    return Math.sign(year) === -1 ?
    (-Math.abs(Math.ceil(year/1000))) : Math.ceil(year/1000);
}