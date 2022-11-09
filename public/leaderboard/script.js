window.addEventListener("load",async()=>{
	getData()
})

async function getData(){
	await fetch("https://FeatureMe-Server.mksksub.repl.co/api/get/leaderboard")
  .then(res => {
    return res.json();
  })
  .then(data => {
		console.log(data)
    setView(data);
  })
  /* .catch(error => {
		window.alert("Failed to load leaderboard. Please try again later.")
	}); */
}

function setView(listdata){
	console.log(listdata)
	for(i of listdata){
		const data = `
		<div class="content">
			<span class="score">${i.music}</span>
			<span class="score">${i.score}</span>
			<span class="rank">${i.rank}</span>
			<span class="user">${i.name}</span>
			<span class="time">${i.time}</span>
		</div>
		`
		document.querySelector("#board").insertAdjacentHTML('beforeend',data)
	}
}