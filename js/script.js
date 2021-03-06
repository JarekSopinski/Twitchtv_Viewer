const $channelsCounter = $("#channelsCounter");
const $channelsSelect = $("#channelsSelect");
const $channelsList = $("#channelsList");
const $newChannelInput = $("#newChannelInput");
const $newChannelBtn = $("#newChannelBtn");

const API_URL = "https://wind-bow.gomix.me/twitch-api";
const wrongChannelNameMsg = "Couldn't find this channel. Remember to input exact channel's name.";
const defaultErrorMsg = "An error occurred. It might be a server error or you might be offline. Please check your connection.";
const logoPlaceholder = "img/twitch-logo-256x256.png";
const streamPreviewPlaceholder = "img/twitch320x180.jpeg";

const channelsData = [
    // all data from API are stored here; structure: [ { channelInfo:{}, streamInfo:{} } ]
];

const displayedChannelsNames = [
    "ESL_SC2",
    "OgamingSC2",
    "freecodecamp",
    "RobotCaleb",
    "ninja",
    "OverwatchLeague",
    "EASPORTSFIFA"
];

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
        .then(() => renderChannel("all"))
        .then((channelsCount) => updateActiveChannelsCounter(channelsCount))
        .catch(error => alert(defaultErrorMsg))

};

const fetchDataFromTwitchAPI = (channelName, typeOfCall) => {

    return $.ajax({
        dataType: "jsonp", // jsonp is needed to prevent CORS problems
        url: `${API_URL}/${typeOfCall}/${channelName}`
    })

};

const passActiveChannelsDataToClass = (data) => {

    if (data.stream && data.stream.channel.display_name) {

        const channelName = data.stream.channel.display_name;
        const channelLogo = data.stream.channel.logo || logoPlaceholder;
        const channelContent = data.stream.channel.game || "";
        const channelUrl = data.stream.channel.url || "#";
        const channelFollowers = data.stream.channel.followers || "";

        const isActive = true;
        const streamStatus = data.stream.channel.status || "";
        const streamViewers = data.stream.viewers || "";
        const streamPreviewImg = data.stream.preview.large || streamPreviewPlaceholder;

        channelsData.push({
            "channelInfo": new channelInfo(channelName, channelLogo, channelContent, channelUrl, channelFollowers),
            "streamInfo": new streamInfo(isActive, streamStatus, streamViewers, streamPreviewImg)
        });

        activeChannels.push(channelName)

    }

};

const passInactiveChannelsDataToClass = (data) => {

    if(!data.display_name) { alert(wrongChannelNameMsg) }

    if (!activeChannels.includes(data.display_name) && data.display_name) {

        const channelName = data.display_name;
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

        inactiveChannels.push(channelName);

    }

};

const renderChannel = (filter) => {

    if (filter === "active") {

        channelsData.forEach(channel => {

            if (channel.streamInfo.isActive) {
                $channelsList.append(addChannelToList(channel))
            }

        });

    } else if (filter === "inactive") {

        channelsData.forEach(channel => {
            if (!channel.streamInfo.isActive) {
                $channelsList.append(addChannelToList(channel))
            }
        });

    } else {
        // displaying all, but only after fetching data from API
        // displaying all after changing select's value works directly from filterDisplayedChannels()!
        channelsData.forEach(channel => {
            if (!renderedChannels.includes(channel)) {
                renderedChannels.push(channel);
                $channelsList.append(addChannelToList(channel))
            }
        });

    }

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

    return $(`<li style=${itemBgColor}>
                    <a href=${channelUrl} target="_blank">
                        <div class="channelsListItem">
                        
                            <img src=${channelLogo} class="channelLogo">
    
                            <div class="streamDetails">
                                <h2>${channelName}</h2>
                                <h3>${channelContent}</h3>
                                <p>${streamStatus}</p>
                                <p>Watching: ${streamViewers}</p>
                                <p>Followers: ${channelFollowers}</p>
                            </div>
                           
                            <img src=${streamPreviewImg} class="streamPreview">
    
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

const filterDisplayedChannels = (filter) => {

    switch (filter) {
        case "active":
            $channelsList.empty();
            renderChannel("active");
            break;
        case "inactive":
            $channelsList.empty();
            renderChannel("inactive");
            break;
        default:
            $channelsList.empty();
            channelsData.forEach(channel => $channelsList.append(addChannelToList(channel)))
    }

};

const handleInitialRendering = () => displayedChannelsNames.forEach(channelName => getChannelsData(channelName));
const handleChannelsSelect = () => filterDisplayedChannels($channelsSelect.val());
const handleNewChannelBtn = () => getChannelsData($newChannelInput.val());


$(window).on( "load", handleInitialRendering);
$channelsSelect.on("change", handleChannelsSelect);
$newChannelBtn.on("click", handleNewChannelBtn)