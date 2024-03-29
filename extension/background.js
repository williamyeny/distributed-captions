console.log('init')

let getCaptions = (videoId) => {
    return new Promise((resolve, reject) => {
        fetch(`http://video.google.com/timedtext?lang=en&v=${videoId}`, {"body":null,"method":"GET","mode":"cors"})
            .then(response => response.text())
            .then(str =>  resolve(str))
    })
}

const url = false ? 'ws://localhost:8000' : 'wss://distributed-captions.appspot.com'
const socket = new WebSocket(url)

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
        if (port.name == 'getCaptions') {
            getCaptions(msg.videoId).then((data) => {
                console.log(data)
                port.postMessage(data)
            })
        } else if (port.name == 'sendCaption') {
            console.log(msg)
            socket.send(msg)
        }
    })
})
