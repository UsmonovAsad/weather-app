window.addEventListener("DOMContentLoaded",() => {
	function $(a) {
		return document.querySelector(a);
	}

	function $All(a) {
		return document.querySelectorAll(a);
	}

	const input = $("input"),
		searchBtn = $(".search-btn-1"),
		getLocationBtn = $(".search-btn-2"),
		status = $("p.status"),
		icon = $(".icon"),
		temp = $(".temp"),
		how = $(".how"),
		location = $(".location"),
		aboutTemp = $(".about-temp div"),
		aboutHumidity = $(".about-humidity div");

	const api = {
		key: "f4cd5a7d39b7d59e5200d919920ef900",
		url: "https://api.openweathermap.org/data/2.5/weather?"
	};

	defaultElements();
	function defaultElements() {
		fetchData(`${api.url}q=London&units=metric&appid=${api.key}`)
	}

	searchBtn.addEventListener("click", e => {
		e.preventDefault();
		fetchData(`${api.url}q=${input.value}&units=metric&appid=${api.key}`,input.value);
	});

	window.addEventListener("keydown", e => {
		if (e.key === "Enter") {
			fetchData(`${api.url}q=${input.value}&units=metric&appid=${api.key}`,input.value);
		}
		
	});

	getLocationBtn.addEventListener("click", e => {
		e.preventDefault();
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onSuccess,onError);
		} else {
			status.innerText = "Your browser not support geolocation api!";
			status.style.color = "red";
		}
	});

	function onSuccess(position) {
		const {latitude, longitude} = position.coords;
	    fetchData(`${api.url}lat=${latitude}&lon=${longitude}&units=metric&appid=${api.key}`);
	}
	function onError(e) {
		status.innerText = e.message;
		status.style.color = "red";
	}

	function fetchData(apiUrl,value) {
		status.style.color = "blue";
		status.innerText = "Getting weather details...";
		fetch(apiUrl).then(res => res.json())
					.then(data => innerHtml(data,value))
					.catch(() => {
						status.innerText = "Something went wrong"
						status.style.color = "red";
					});
	}

	function innerHtml(data,value) {
		if (data.cod == 404) {
			status.innerHTML = `"${value}"  isn't a valid city name`;
			status.style.color = "red";
		} else {
			const id = data.weather[0].id;

			if(id == 800){
	            icon.innerHTML = "<i class='fas fa-cloud-sun'></i>";
	        }else if(id >= 200 && id <= 232){
	        	icon.innerHTML = "<i class='fas fa-cloud-sun-rain'></i>";  
	        }else if(id >= 600 && id <= 622){
	        	icon.innerHTML = "<i class='far fa-snowflake'></i>";
	        }else if(id >= 701 && id <= 781){
	        	icon.innerHTML = "<i class='fas fa-smog'></i>";
	        }else if(id >= 801 && id <= 804){
	        	icon.innerHTML = "<i class='fas fa-cloud'></i>";
	        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
	        	icon.innerHTML = "<i class='fas fa-cloud-showers-heavy'></i>";
	        }

			location.innerText = `${data.name}, ${data.sys.country}`;
			temp.innerText = `${Math.round(data.main.temp)}°C`;
			how.innerText = data.weather[0].description;
			aboutTemp.innerText = `${Math.round(data.main.feels_like)}°C Feels like`;
			aboutHumidity.innerText = `${data.main.humidity}% Humidity`;
			status.innerText = "";
		}
	}
});