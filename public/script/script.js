const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((postition) => {
        const { latitude, longitude } = postition.coords;
        socket.emit("send-location", { latitude, longitude })
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
    });
}
const map = L.map("map").setView([0, 0], 10);
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Ashish"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLang([latitude, longitude])
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("disconnect", (id) =>{
if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
}
})