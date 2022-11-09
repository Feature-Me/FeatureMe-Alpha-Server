function calcLevel(exp) {
	let requiredexp=1000;
	let level=0;
    for(;;){
		level++;
		requiredexp+=Math.pow(level*1000,1.1)+1000
		if(requiredexp>exp) break;
	}
	return [level,requiredexp];
}
   
   module.exports = calcLevel;