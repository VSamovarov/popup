import {loadYouTubeFrameApi} from './loadYouTubeFrameApi.js'

/**
 *
 * @param {string} videoId
 * @param {string} containerId
 * @returns {YT.Player}
 */
export default function youTubePlayer(videoId, containerId) {
  return new YT.Player(containerId, {
    height: '100%',
    width: '100%',
    videoId: videoId,
    playerVars: {
      loop: 0,
      autoplay: 1,
      showinfo: 1,
      modestbranding: 1,
      fs: 0,
      autohide: 0,
      rel: 0,
    },
    events: {
      onReady: function (event) {
      }
    }
  })
}
