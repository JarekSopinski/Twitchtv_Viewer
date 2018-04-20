const $channelsList = $("#channelsList");

const API_URL = "https://wind-bow.gomix.me/twitch-api";
const logoPlaceholder = "img/twitch-logo-256x256.png";
const streamPreviewPlaceholder = "img/twitch320x180.jpeg";

const channelsData = [
    // all data from API are stored here; structure: [ { channelInfo:{}, streamInfo:{} } ]
];

const displayedChannelsNames = [
    "ESL_SC2",
    // "OgamingSC2",
    // "cretetion",
    "freecodecamp",
    // "storbeck",
    // "habathcx",
    // "RobotCaleb",
    // "noobs2ninjas"
]; // Temporary disabled most items to prevent doing too many calls in development stage

const activeChannels = [];
const renderedChannels = [];

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
    constructor(isActive, streamStatus, streamViewers, streamPreviewImg) {
        this.isActive = isActive;
        this.streamStatus = streamStatus;
        this.streamViewers = streamViewers;
        this.streamPreviewImg = streamPreviewImg
    }
}

const getChannelsData = (channelName) => {

    fetchDataFromTwitchAPI(channelName, "streams")
        .then(data => passActiveChannelsDataToClass(data))
        .then(() => fetchDataFromTwitchAPI(channelName, "channels"))
        .then(data => passInactiveChannelsDataToClass(data))
        .then(() => renderChannel())
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
        const streamStatus = data.stream.channel.status || "unknown";
        const streamViewers = data.stream.viewers || "unknown";
        const streamPreviewImg = data.stream.preview.large || streamPreviewPlaceholder;

        channelsData.push({
            "channelInfo": new channelInfo(channelName, channelLogo, channelContent, channelUrl, channelFollowers),
            "streamInfo": new streamInfo(isActive, streamStatus, streamViewers, streamPreviewImg)
        });

        activeChannels.push(channelName)

    }

};

const passInactiveChannelsDataToClass = (data) => {

    if (!activeChannels.includes(data.display_name)) {

        const channelName = data.display_name || "";
        const channelLogo = data.logo || logoPlaceholder;
        const channelContent = data.game || "";
        const channelUrl = data.url || "#";
        const channelFollowers = data.followers || "";

        const isActive = false;
        const streamStatus = "Offline";
        const streamViewers = 0;

        channelsData.push({
            "channelInfo": new channelInfo(channelName, channelLogo, channelContent, channelUrl, channelFollowers),
            "streamInfo": new streamInfo(isActive, streamStatus, streamViewers, streamPreviewPlaceholder)
        });

    }

};

const renderChannel = () => {

  channelsData.forEach(channel => {
      if (!renderedChannels.includes(channel)) {
          renderedChannels.push(channel);
          $channelsList.append(addChannelToList(channel))
      }
  })

};

const addChannelToList = (channel) => {

    const { channelName, channelLogo, channelContent, channelUrl, channelFollowers } = channel.channelInfo;
    const { isActive, streamStatus, streamViewers, streamPreviewImg } = channel.streamInfo;

    let itemBgColor;
    isActive ? itemBgColor = "background-color:#9BC53D" : itemBgColor = "background-color:#CFD2CD";

    return $(`<li id="channelsList-item" style=${itemBgColor}>
                    <a href=${channelUrl}>
                        <div id="channelsList-item-streamInfo">
                        
                            <img src=${channelLogo} id="channelLogo">
    
                            <div id="streamDetails">
                                <p>${channelName}</p>
                                <p>Status: ${streamStatus}</p>
                                <p>${channelContent}</p>
                                <p>Watching: ${streamViewers}</p>
                                <p>Followers: ${channelFollowers}</p>
                            </div>
                           
                            <img src=${streamPreviewImg} id="streamPreview">
    
                        </div>
                    </a>              
                  </li>`)

};

$(document).ready(() => {

    $(window).on( "load", displayedChannelsNames.forEach(channelName => getChannelsData(channelName)))

});