# Simple PopUp script

The goal is to open PopUp by clicking on HTML objects with certain attributes

Like `<button data-popup-open-target-by-id="popup-1">Click me</button>`

A content creation function is bound to `data-popup-open-target-by-id`, which becomes the content of the window

The script itself only creates a window object with methods `open`, `close`, `setContent` and a factory method

The script also adds the corresponding events to the document - `popup:open`, `popup:close`, `popup:startFetchContent`, `popup:endFetchContent`,
popup:errorFetchContent

Singleton. Content is cached.

I used something similar in several projects and decided to separate it into a separate module.

There are plans to tighten up the template mechanism, tidy things up a bit and make npm package