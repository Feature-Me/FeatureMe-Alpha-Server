function selectSort(array) {
    for(var i = 0; i<array.length-1;i++){

        var min = array[i];
        var k = i;
    
        for(var j = i+ 1; j<array.length;j++){
            if(min >array[j]){
                min = array[j];
                k = j;
            }
        }

        var tmp = array[i];
        array[i] = array[k];
        array[k] =tmp;
    }
    return array
   }
   
   module.exports = selectSort;