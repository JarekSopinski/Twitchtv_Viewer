class channelInfo {
    constructor(channelName, channelLogo, channelContent, channelUrl, channelFollowers) {
        this.channelName = channelName;
        this.channelLogo = channelLogo;
        this.channelContent = channelContent;
        this.channelUrl = channelUrl;
        this.channelFollowers = channelFollowers
    }
}

class streamInfo {
    constructor(isActive, streamContent, streamStatus, streamViewers, streamPreviewImg) {
        this.isActive = isActive;
        this.streamContent = streamContent;
        this.streamStatus = streamStatus;
        this.streamViewers = streamViewers;
        this.streamPreviewImg = streamPreviewImg
    }
}

const API_URL = "https://wind-bow.gomix.me/twitch-api";
const logoPlaceholder = "img/twitch-logo-256x256.png";
const streamPreviewPlaceholder = "img/twitch320x180.jpeg";

const channelsData = [
    // structure: [ { channelInfo:{}, streamInfo:{} } ]
];

const displayedChannelsNames = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas"
]; // TODO: while testing css, I should temporary remove all but one to prevent doing too many calls

const activeChannels = [];

const getChannelsData = (channelName) => {

    fetchDataFromTwitchAPI(channelName, "streams")
        .then(data => passActiveChannelsDataToClass(data))
        .then(() => fetchDataFromTwitchAPI(channelName, "channels"))
        .then(data => passInactiveChannelsDataToClass(data))
        .catch(error => alert(error))

};

const fetchDataFromTwitchAPI = (channelName, typeOfCall) => {

    return $.ajax({
        dataType: "jsonp", // jsonp is needed to prevent CORS problems
        url: `${API_URL}/${typeOfCall}/${channelName}`
    })

};

const passActiveChannelsDataToClass = (data) => {

    if (data.stream) {

        const channelName = data.stream.channel.display_name || "unknown";
        const channelLogo = data.stream.channel.logo || logoPlaceholder;
        const channelContent = data.stream.channel.game || "unknown";
        const channelUrl = data.stream.channel.url || "https://www.twitch.tv/";
        const channelFollowers = data.stream.channel.followers || "unknown";

        const isActive = true;
        const streamContent = data.stream.game || "unknown";
        const streamStatus = data.stream.channel.status || "unknown";
        const streamViewers = data.stream.viewers || "unknown";
        const streamPreviewImg = data.stream.preview.medium || streamPreviewPlaceholder;

        channelsData.push({
            "channelInfo": new channelInfo(channelName, channelLogo, channelContent, channelUrl, channelFollowers),
            "streamInfo": new streamInfo(isActive, streamContent, streamStatus, streamViewers, streamPreviewImg)
        });

        activeChannels.push(channelName)

    }

};

const passInactiveChannelsDataToClass = (data) => {

    if (!activeChannels.includes(data.display_name)) {

        const channelName = data.display_name || "unknown";
        const channelLogo = data.logo || logoPlaceholder;
        const channelContent = data.game || "unknown";
        const channelUrl = data.url || "https://www.twitch.tv/";
        const channelFollowers = data.followers || "unknown";

        const isActive = false;
        const streamContent = null;
        const streamStatus = null;
        const streamViewers = null;
        const streamPreviewImg = null;

        channelsData.push({
            "channelInfo": new channelInfo(channelName, channelLogo, channelContent, channelUrl, channelFollowers),
            "streamInfo": new streamInfo(isActive, streamContent, streamStatus, streamViewers, streamPreviewImg)
        });

    }

};

$(document).ready(() => {

    $(window).on( "load", displayedChannelsNames.forEach(channelName => getChannelsData(channelName)))

});