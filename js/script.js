class channelInfo {
    constructor(channelName, channelLogo, channelContent, channelUrl) {
        this.channelName = channelName;
        this.channelLogo = channelLogo;
        this.channelContent = channelContent;
        this.channelUrl = channelUrl
    }
}

class streamInfo {
    constructor(isOnline, streamContent, streamStatus, streamViewers, streamPreviewImg) {
        this.isOnline = isOnline;
        this.streamContent = streamContent;
        this.streamStatus = streamStatus;
        this.streamViewers = streamViewers;
        this.streamPreviewImg = streamPreviewImg
    }
}

const API = "https://wind-bow.gomix.me/twitch-api/";
const logoPlaceholder = "img/twitch-logo-256x256.png";
const streamPreviewPlaceholder = "img/twitch320x180.jpeg";

const channelsData = [

    // structure: [ { channelInfo:{}, streamInfo:{} } ]

    {
        "channelInfo": new channelInfo("Test channel", logoPlaceholder, "Coding", "https://freecodecamp.com"),
        "streamInfo": new streamInfo(false, "JavaScript", "Learn to code in JS", 100, streamPreviewPlaceholder)
    },

];

const displayedChannels = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas"
];

const getChannelsData = (channel) => {

    fetchDataFromTwitchAPI(channel, "stream")
        .then(data => console.log(data))
        .catch(error => handleError(error))

};

const fetchDataFromTwitchAPI = (channelName, typeOfData) => {

    let URL;
    typeOfData === "stream" ?
        URL = `${API}streams/`
        :
        URL = `${API}channels/`;

    return $.ajax({
        dataType: "jsonp", // jsonp is needed to prevent CORS problems
        url: `${URL}${channelName}`
    })

};

const handleError = error => alert(error);

$(document).ready(() => {

    $(window).on( "load", displayedChannels.forEach(channel => getChannelsData(channel)))

});