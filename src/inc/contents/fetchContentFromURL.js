/**
 * !!! For example only !!!
 * Example of an asynchronous function to retrieve content from a URL
 *
 * You can do the same for various APIs
 *
 * @param {string} url
 * @param {string} selector - on the page received from the URL
 * @return {Promise<HTMLElement|DocumentFragment>}
 */
export default function (url, selector) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.text()
      })
      .then((content) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, 'text/html')
        const fetchContent = doc.querySelector(selector ?? 'body')
        resolve(fetchContent)
      })
      .catch((error) => {
        reject(error)
      })
  })
}