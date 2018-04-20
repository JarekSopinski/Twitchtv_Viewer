/*TODO:
1) Adding new channel
2) Error handling (new channel name)
3) Refactor names is DOM
DONE 4) Better colors
DONE 5) Round logo
DONE 6) Rest of styles
7) New channels list
8) Display all / online / offline
DONE 9) List how many are online
*/

const $channelsCounter = $("#channelsCounter");
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
const inactiveChannels = [];
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
        .then((channelsCount) => updateActiveChannelsCounter(channelsCount))
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

        inactiveChannels.push(channelName)

    }

};

const renderChannel = () => {

  channelsData.forEach(channel => {
      if (!renderedChannels.includes(channel)) {
          renderedChannels.push(channel);
          $channelsList.append(addChannelToList(channel))
      }
  });

  return {
      activeChannels: activeChannels.length,
      inactiveChannels: inactiveChannels.length,
      allChannels: channelsData.length
  };

};

const addChannelToList = (channel) => {

    const { channelName, channelLogo, channelContent, channelUrl, channelFollowers } = channel.channelInfo;
    const { isActive, streamStatus, streamViewers, streamPreviewImg } = channel.streamInfo;

    let itemBgColor;
    isActive ? itemBgColor = "background-color:#9BC53D" : itemBgColor = "background-color:#7C7A7A";

    return $(`<li id="channelsList-item" style=${itemBgColor}>
                    <a href=${channelUrl} target="_blank">
                        <div id="channelsList-item-streamInfo">
                        
                            <img src=${channelLogo} id="channelLogo">
    
                            <div id="streamDetails">
                                <h2>${channelName}</h2>
                                <h3>${channelContent}</h3>
                                <p>Status: ${streamStatus}</p>
                                <p>Watching: ${streamViewers}</p>
                                <p>Followers: ${channelFollowers}</p>
                            </div>
                           
                            <img src=${streamPreviewImg} id="streamPreview">
    
                        </div>
                    </a>              
                  </li>`)

};

const updateActiveChannelsCounter = (channelsCount) => {

    const { activeChannels, inactiveChannels, allChannels } = channelsCount;

    $channelsCounter.empty();
    $channelsCounter.append(`
            <h2>All: ${allChannels}</h2>
            <h2>Online: ${activeChannels}</h2>
            <h2>Offline: ${inactiveChannels}</h2>
`)

};

$(document).ready(() => {

    $(window).on( "load", displayedChannelsNames.forEach(channelName => getChannelsData(channelName)));

});