const Plugin = (args) => {
  // DOM Elements
  const parentContainerEl = document.createElement('div')
  const titleEl = document.createElement('p')
  const staticRadioButtonEl = document.createElement('input')
  const staticRadioButtonLabelEl = document.createElement('label')
  const dynamicRadioButtonEl = document.createElement('input')
  const dynamicRadioButtonLabelEl = document.createElement('label')
  const regexInputEl = document.createElement('input')
  const reuseableParentContainerEl = document.createElement('div')
  const reuseableRadioButtonEl = document.createElement('input')
  const reuseableRadioButtonLabelEl = document.createElement('label')
  const reuseableInputEl = document.createElement('input')

  // Find a current radio button setting in the annotation
  // giving full object with purpose and type
  const currentRadioButtonBody = args.annotation
    ? args.annotation.bodies.find((b) => b.purpose === 'bounding-box-type')
    : null


  // Keep the value of radio in a variable // will give static or dynamic value
  const currentRadioButtonValue = currentRadioButtonBody
    ? currentRadioButtonBody.value
    : null


  // Find a current regex input setting in the annotation body
  const currentRegexInputBody = args.annotation
    ? args.annotation.bodies.find((b) => b.purpose === 'dynamic-regex-input')
    : null

  // Keep the value of regex in a variable
  const currentRegexInputValue = currentRegexInputBody
    ? currentRegexInputBody.value
    : null

  // Find a current reuseable radio button settings in the annotation body
  const currentReuseableRadioButtonBody = args.annotation
    ? args.annotation.bodies.find((b) => b.purpose === 'bounding-box-reuseable')
    : null

  // Keep the value of reuseable radio button in a variable
  const currentReuseableRadioButtonValue = currentReuseableRadioButtonBody
    ? currentReuseableRadioButtonBody.value
    : null

  // Find a current reuseable input setting in the annotation body
  const currentReuseableInputBody = args.annotation
    ? args.annotation.bodies.find(
      (b) => b.purpose === 'reuseable-bounding-box-input'
    )
    : null

  // Keep the value of resuable name in a variable
  const currentReuseableInputValue = currentReuseableInputBody
    ? currentReuseableInputBody.value
    : null

  // console.log(currentReuseableInputValue)

  staticRadioButtonEl.type = 'radio'
  staticRadioButtonEl.id = 'static'
  staticRadioButtonEl.value = 'static'
  staticRadioButtonEl.name = 'bounding_box_type'
  staticRadioButtonEl.dataset.tag = 'static'
  // staticRadioButtonEl.checked = currentRadioButtonValue === 'static'
  staticRadioButtonEl.checked = true

  // Setup static radio label
  staticRadioButtonLabelEl.htmlFor = 'static'
  staticRadioButtonLabelEl.innerHTML = 'Static'

  // Setup dynamic radio button
  dynamicRadioButtonEl.type = 'radio'
  dynamicRadioButtonEl.id = 'dynamic'
  dynamicRadioButtonEl.value = 'dynamic'
  dynamicRadioButtonEl.name = 'bounding_box_type'
  dynamicRadioButtonEl.dataset.tag = 'dynamic'
  dynamicRadioButtonEl.checked = currentRadioButtonValue === 'dynamic'
  // dynamicRadioButtonEl.checked = false

  // Setup dynamic radio label
  dynamicRadioButtonLabelEl.htmlFor = 'dynamic'
  dynamicRadioButtonLabelEl.innerHTML = 'Dynamic'

  // Setup regex input
  regexInputEl.placeholder = 'Enter Regex!'
  regexInputEl.name = 'regexText'

  // Pre-populate regex input value if exist
  if (currentRegexInputValue) {
    regexInputEl.value = currentRegexInputValue
  }

  // Setup reuseable radio button
  reuseableRadioButtonEl.type = 'radio'
  reuseableRadioButtonEl.name = 'reuseable_bounding_box'
  reuseableRadioButtonEl.id = 'reuseable'
  reuseableRadioButtonEl.value = 'reuseable'
  reuseableRadioButtonEl.checked =
    currentReuseableRadioButtonValue === 'reuseable'

  // Setup reuseable radio label
  reuseableRadioButtonLabelEl.htmlFor = 'reuseable'
  reuseableRadioButtonLabelEl.innerHTML = 'Reuseable'

  // Setup reuseable name input
  reuseableInputEl.type = 'text'
  reuseableInputEl.placeholder = 'Enter Reuseable Name!'

  // Pre-populate reuseable input value if exist
  if (currentReuseableInputValue) {
    reuseableInputEl.value = currentReuseableInputValue
  }

  // Setup the title text
  titleEl.innerHTML = 'Select Bounding Box Type'

  // Listener for static radio button
  staticRadioButtonEl.addEventListener('click', () => {
    if (currentRadioButtonValue) {
      args.onUpdateBody(currentRadioButtonBody, {
        type: 'TextualBody',
        purpose: 'bounding-box-type',
        value: 'static',
      })
    } else {
      args.onAppendBody({
        type: 'TextualBody',
        purpose: 'bounding-box-type',
        value: 'static',

      })
    }
  })

  // Listener for dynamic radio button
  dynamicRadioButtonEl.addEventListener('click', () => {
    if (currentRadioButtonValue) {
      args.onUpdateBody(currentRadioButtonBody, {
        type: 'TextualBody',
        purpose: 'bounding-box-type',
        value: 'dynamic',
      })
    } else {
      args.onAppendBody({
        type: 'TextualBody',
        purpose: 'bounding-box-type',
        value: 'dynamic',
      })
    }
  })

  // Listener for regex input
  regexInputEl.addEventListener('change', (e) => {
    if (currentRegexInputValue) {
      args.onUpdateBody(currentRegexInputBody, {
        type: 'TextualBody',
        purpose: 'dynamic-regex-input',
        value: e.target.value,
      })
    } else {
      args.onAppendBody({
        type: 'TextualBody',
        purpose: 'dynamic-regex-input',
        value: e.target.value,
      })
    }
  })

  // Listener for reuseable radio button
  reuseableRadioButtonEl.addEventListener('click', () => {
    if (currentReuseableRadioButtonValue) {
      args.onUpdateBody(currentReuseableRadioButtonBody, {
        type: 'TextualBody',
        purpose: 'bounding-box-reuseable',
        value: 'reuseable',
      })
    } else {
      args.onAppendBody({
        type: 'TextualBody',
        purpose: 'bounding-box-reuseable',
        value: 'reuseable',
      })
    }
  })

  // Listener for reuseable name input
  reuseableInputEl.addEventListener('change', (e) => {
    if (currentReuseableInputValue) {
      args.onUpdateBody(currentReuseableInputBody, {
        type: 'TextualBody',
        purpose: 'reuseable-bounding-box-input',
        value: e.target.value,
      })
    } else {
      args.onAppendBody({
        type: 'TextualBody',
        purpose: 'reuseable-bounding-box-input',
        value: e.target.value,
      })
    }
  })

  // Appending the child nodes to the parent element
  parentContainerEl.appendChild(titleEl)
  parentContainerEl.appendChild(staticRadioButtonLabelEl)
  parentContainerEl.appendChild(staticRadioButtonEl)
  parentContainerEl.appendChild(dynamicRadioButtonLabelEl)
  parentContainerEl.appendChild(dynamicRadioButtonEl)
  reuseableParentContainerEl.appendChild(reuseableRadioButtonLabelEl)
  reuseableParentContainerEl.appendChild(reuseableRadioButtonEl)
  parentContainerEl.appendChild(reuseableParentContainerEl)

  if (currentRadioButtonValue === 'dynamic') {
    parentContainerEl.appendChild(regexInputEl)
  }

  if (currentReuseableRadioButtonValue === 'reuseable') {
    reuseableParentContainerEl.appendChild(reuseableInputEl)
    parentContainerEl.appendChild(reuseableParentContainerEl)
  }
  return parentContainerEl
}

export default Plugin
