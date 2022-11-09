function searchuser(){
	const data = document.querySelector('.ef[name="name"]').value;
	location.href = `https://FeatureMe-Server.mksksub.repl.co/account/${data}`
}