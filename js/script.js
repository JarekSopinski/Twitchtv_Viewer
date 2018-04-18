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
]; //TODO: if user wants to display additional channel, simply push input to this array and run getChannelsData again

const getChannelsData = (channel) => {

    fetchDataFromTwitchAPI(channel, "stream")
        .then(data => passStreamDataToClass(data))
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

const passStreamDataToClass = (data) => {

    data.stream ? setActiveStreamData(data) : setStreamAsOffline(data)

};

const setActiveStreamData = (data) => {

    const channelName = data.stream.channel.display_name || "unknown";
    const channelLogo = data.stream.channel.logo || logoPlaceholder;
    const channelContent = data.stream.channel.game || "unknown";
    const channelUrl = data.stream.channel.url || "https://www.twitch.tv/";

    const isOnline = true;
    const streamContent = data.stream.game || "unknown";
    const streamStatus = data.stream.channel.status || "unknown";
    const streamViewers = data.stream.viewers || "unknown";
    const streamPreviewImg = data.stream.preview.medium || streamPreviewPlaceholder;

    channelsData.push({
        "channelInfo": new channelInfo(channelName, channelLogo, channelContent, channelUrl),
        "streamInfo": new streamInfo(isOnline, streamContent, streamStatus, streamViewers, streamPreviewImg)
    })

};

const setStreamAsOffline = (data) => {
    console.log("stream is offline");
};

const handleError = error => alert(error);

$(document).ready(() => {

    $(window).on( "load", displayedChannels.forEach(channel => getChannelsData(channel)))

});