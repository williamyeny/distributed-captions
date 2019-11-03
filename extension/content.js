let getCaptionsPort = chrome.runtime.connect({name: 'getCaptions'})
let sendCaptions = chrome.runtime.connect({name: 'sendCaptions'})

getCaptionsPort.postMessage({videoId: (new URLSearchParams(window.location.search)).get('v')})

getCaptionsPort.onMessage.addListener((msg) => {
    console.log(msg)
    let captionsXml = (new window.DOMParser()).parseFromString(msg, "text/xml")
    console.log(captionsXml)
})


