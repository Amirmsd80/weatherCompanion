navigator.geolocation.getCurrentPosition((pos) => {
    const crds = pos.coords
    console.log(crds);
})