let getCaptionsPort = chrome.runtime.connect({name: 'getCaptions'})
let sendCaptionPort = chrome.runtime.connect({name: 'sendCaption'})
let captions = []
let video = document.getElementsByTagName('video')[0]
let lastCaption = '' // to prevent redundant messaging

getCaptionsPort.postMessage({videoId: (new URLSearchParams(window.location.search)).get('v')})
getCaptionsPort.onMessage.addListener((msg) => {
    console.log(msg)
    let captionsXml = (new window.DOMParser()).parseFromString(msg, "text/xml")
    let text = captionsXml.getElementsByTagName('text')
    for (let i = 0; i < text.length; i++) {
        captions.push({
            text: text[i].innerHTML,
            start: parseFloat(text[i].getAttribute('start')),
            dur: parseFloat(text[i].getAttribute('dur'))
        })
    }
})

let sendCaption = (text) => {
    if (lastCaption != text) {
        sendCaptionPort.postMessage(text)
        lastCaption = text
    }
}

video.ontimeupdate = () => {
    if (captions.length > 0) {
        time = video.currentTime
        for (let i = 0; i < captions.length; i++) {
            if (time >= captions[i].start && time <= captions[i].start + captions[i].dur) { 
                sendCaption(captions[i].text + ' | ' + captions[i].start)
                return
            }
        }
        sendCaption('%%clear')
    }
}
