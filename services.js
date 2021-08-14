
import * as locator from "@arcgis/core/rest/locator";
import axios from 'axios'

const geocodeUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"


// call suggest API and return the magicKey found for the provided address
const getSuggestion = (address) => {
    return new Promise((resolve, reject) => {
        console.log('getting suggest...')
        let params = { text: address }
        locator
            .suggestLocations(geocodeUrl, params)
            .then((response) => {
                // console.log('suggest response:', response[0]);
                resolve((response[0].magicKey));
            })
            .catch((error) => {
                reject(console.log("Error with Suggest:", error));
            });
    })
}

const getSuggestions = (address) => {
    return new Promise((resolve, reject) => {
        console.log('getting suggest...')
        let params = { text: address }
        locator
            .suggestLocations(geocodeUrl, params)
            .then((response) => {
                // console.log('suggest response:', response[0]);
                resolve((response));
            })
            .catch((error) => {
                reject(console.log("Error with Suggest:", error));
            });
    })
}

const getAddressLocation = (magicKey) => {
    return new Promise((resolve, reject) => {
        let findAddressUrl = geocodeUrl + "/findAddressCandidates?";
        findAddressUrl += "f=pjson&" + "magicKey=" + magicKey;
        console.log("findAddressUrl:", findAddressUrl);
        axios
            .get(findAddressUrl)
            .then((response) => {
                const location = response.data.candidates[0].location
                console.log("findAddress response:", response.data.candidates[0]);
                console.log("location in services:", location)
                resolve(location)
            })
            .catch((error) => {
                console.log("findAddress error:", error);
                reject(error)
            });
    })
}


export { getSuggestion, getSuggestions, getAddressLocation }