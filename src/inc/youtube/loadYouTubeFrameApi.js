/**
 * Check if YouTube IFrame Player API is connected,
 * and connect it if it is not so
 * @returns {Promise}
 */
export function loadYouTubeFrameApi() {
  return new Promise((resolve, reject) => {
    if (window.YT && YT.Player) {
      // YouTube IFrame API is already connected
      resolve(YT)
    } else {
      //Connecting YouTube IFrame API
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      // We wait until the API loads
      window.onYouTubeIframeAPIReady = function () {
        resolve(YT)
      }
    }
  })
}

// Calling a function
/*
loadYouTubeFrameApi().then(YT => {
//   // Here you can use YT (YouTube IFrame Player API)
})
*/