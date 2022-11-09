function calcRating(best,recent) {
	const selectSort = require('./selectSort')
    const sortedbest = selectSort(recent).slice(-10);
	const allData = best.concat(sortedbest);
	let allDatainZero = new Array(40).fill(0);
	for(const i in allData){
		if(i!=null) allDatainZero[i] = allData[i];
		else allDatainZero[i] = 0;
	}
	let allDataSum=0;
	let avg;

	for(const i of allDatainZero){
		allDataSum+=i;
	}
	avg = Math.floor((allDataSum/allDatainZero.length)*100)/100;
	return avg;
}
   
   module.exports = calcRating;

