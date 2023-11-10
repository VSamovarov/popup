/**
 * !!! For example only !!!
 * Example of an asynchronous function to retrieve content from a URL
 *
 * You can do the same for various APIs
 *
 * @param {string} url
 * @param {HTMLElement} popUpButton
 * @return {Promise<HTMLElement>}
 */
export default async function (url, popUpButton) {
  const selector = popUpButton.dataset.selector
  const response = await fetch(url, {
    mode: 'no-cors'
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const content = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/html')
  console.log(doc.querySelector('body'))
  return doc.querySelector(selector ?? 'body')
}