// mock dialog-polyfill
jest.mock('dialog-polyfill', () => ({
  registerDialog: jest.fn((param) => null)
}))
const dialogPolyfill = require('dialog-polyfill')

// mock module object - parameter of constructor TimeoutWarning
let mockModule = {
  querySelector: jest.fn((param) => ({innerHTML: `mqs_${param}`})),
  getAttribute: jest.fn((param) => null)
}
const origMockModule = mockModule

// mock document & window - DOM global values
const { JSDOM } = require('jsdom')
const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window
global.HTMLDialogElement = dom.window.HTMLDialogElement
global.navigator = dom.window.navigator
global.location = dom.window.location


// import TimeoutWarning
const TimeoutWarning = require('../../../../app/templates/components/timeout-warning/timeout-warning')

describe('Timeout Warning', () => {
  it('test TimeoutWarning constructor', () => {
    expect(TimeoutWarning).toBeDefined()

    jest.spyOn(document, 'querySelector').mockImplementation((param) => (`dqs_${param}`))

    expect(new TimeoutWarning(mockModule)).toEqual({
      $module: mockModule,
      $lastFocusedEl: null,
      $closeButton: { innerHTML: 'mqs_.js-dialog-close' },
      $cancelButton: { innerHTML: 'mqs_.js-dialog-cancel' },
      overLayClass: 'govuk-timeout-warning-overlay',
      $fallBackElement: 'dqs_.govuk-timeout-warning-fallback',
      timers: [],
      $countdown: { innerHTML: 'mqs_.timer' },
      $accessibleCountdown: { innerHTML: 'mqs_.at-timer' },
      idleMinutesBeforeTimeOut: 20,
      timeOutRedirectUrl: 'timeout',
      minutesTimeOutModalVisible: 5,
      timeUserLastInteractedWithPage: ''
    })

    mockModule.getAttribute.mockImplementation((param) => {
      switch (param) {
        case 'data-minutes-idle-timeout':
          return 15
        case 'data-url-redirect':
          return 'mock-back-url'
        case 'data-minutes-modal-visible':
          return 10
        default:
          return null
      }
    })

    expect(new TimeoutWarning(mockModule)).toEqual(
      expect.objectContaining({
        idleMinutesBeforeTimeOut: 15,
        timeOutRedirectUrl: 'mock-back-url',
        minutesTimeOutModalVisible: 10
      })
    )
  })

  it('test TimeoutWarning.dialogSupported()', () => {
    global.HTMLDialogElement = jest.fn(() => {})

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      classList: {
        add: (addParam) => null
      }
    }))

    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(true)

    global.HTMLDialogElement = {}
    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(true)

    dialogPolyfill.registerDialog.mockImplementation((param) => { throw Error('mock-error') })
    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(false)
  })

  it('test TimeoutWarning.init()', () => {
    dialogPolyfill.registerDialog.mockImplementation((param) => { throw Error('mock-error') })
    expect(new TimeoutWarning(mockModule).init()).toBe(undefined)

    global.HTMLDialogElement = jest.fn(() => {})
    mockModule = {
      ...mockModule,
      querySelector: jest.fn((paramA) => ({
        addEventListener: jest.fn((paramB) => {})
      })),
      addEventListener: jest.fn((paramC) => {})
    }
    expect(new TimeoutWarning(mockModule).init()).toBe(undefined)

    mockModule = origMockModule
  })

  it('test TimeoutWarning.countIdleTime()', () => {
    expect(new TimeoutWarning(mockModule).countIdleTime()).toBe(undefined)
  })

  it('test TimeoutWarning.openDialog()', () => {
    mockModule = {
      ...mockModule,
      open: 'mock-module-open'
    }
    expect(new TimeoutWarning(mockModule).openDialog()).toBe(undefined)

    mockModule = origMockModule

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      classList: {
        add: (addParam) => null
      },
      setAttribute: (paramA, paramB) => {}
    }))

    mockModule = {
      ...mockModule,
      showModal: jest.fn(() => {})
    }

    const result = new TimeoutWarning(mockModule)
    expect(result.openDialog()).toBe(undefined)
    result.clearTimers()
  })

  it('test TimeoutWarning.startUiCountdown()', () => {
    global.navigator.userAgent = ''

    let result

    mockModule = {
      ...mockModule,
      getAttribute: jest.fn((param) => 1)
    }
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule = {
      ...mockModule,
      querySelector: jest.fn((paramA) => ({
        setAttribute: jest.fn((paramB, paramC) => {})
      })),
      getAttribute: jest.fn((param) => 0)
    }
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule.getAttribute.mockImplementation((param) => (1))
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule.getAttribute.mockImplementation((param) => (0.15))
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule.getAttribute.mockImplementation((param) => (2))
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    mockModule.getAttribute.mockImplementation((param) => (2.15))
    result = new TimeoutWarning(mockModule)
    expect(result.startUiCountdown()).toBe(undefined)
    result.clearTimers()

    global.navigator = dom.window.navigator
    mockModule = origMockModule
  })

  it('test TimeoutWarning.saveLastFocusedEl()', () => {
    jest.spyOn(document, 'querySelector').mockImplementation((param) => ('mock-dqs'))

    let result = new TimeoutWarning(mockModule)
    expect(result.saveLastFocusedEl()).toBe(undefined)
    expect(result.$lastFocusedEl).toBe(null)

    global.document.activeElement = 'mock-element'
    result = new TimeoutWarning(mockModule)
    expect(result.saveLastFocusedEl()).toBe(undefined)

    global.document.activeElement = document.body
    result = new TimeoutWarning(mockModule)
    expect(result.saveLastFocusedEl()).toBe(undefined)
    expect(result.$lastFocusedEl).toBe(null)

    global.document.activeElement = true
    let mockBody = document.createElement('body')
    mockBody.id = 'testing'
    Object.defineProperty(document, 'activeElement', {
      get: () => mockBody
    })
    global.document.querySelector = jest.fn((param) => ('value'))
    expect(result.saveLastFocusedEl()).toBe(undefined)
    expect(result.$lastFocusedEl).toBe('value')

  })

  it('test TimeoutWarning.focusLastFocusedEl()', () => {
    const mockElement = { focus: jest.fn() };
    let timeoutInstance = new TimeoutWarning(mockModule)

    timeoutInstance.$lastFocusedEl= null
    timeoutInstance.setFocusOnLastFocusedEl()
    expect(timeoutInstance.$lastFocusedEl).toBeNull();

    timeoutInstance.$lastFocusedEl = mockElement
    timeoutInstance.setFocusOnLastFocusedEl()
    expect(timeoutInstance.$lastFocusedEl).toBeDefined();

  })

  it('test TimeoutWarning.makePageContentInert()', () => {
    jest.spyOn(document, 'querySelector').mockImplementation((param) => null)
    expect(new TimeoutWarning(mockModule).makePageContentInert()).toBe(undefined)

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      setAttribute: (paramA, paramB) => {}
    }))
    expect(new TimeoutWarning(mockModule).makePageContentInert()).toBe(undefined)
  })

  it('test TimeoutWarning.removeInertFromPageContent()', () => {
    jest.spyOn(document, 'querySelector').mockImplementation((param) => null)
    expect(new TimeoutWarning(mockModule).removeInertFromPageContent()).toBe(undefined)

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      setAttribute: (paramA, paramB) => {}
    }))
    expect(new TimeoutWarning(mockModule).removeInertFromPageContent()).toBe(undefined)
  })

  it('test TimeoutWarning.isDialogOpen()', () => {
    expect(new TimeoutWarning(mockModule).isDialogOpen()).toBe(undefined)
  })

  it('test TimeoutWarning.closeDialog()', () => {
    mockModule = origMockModule
    expect(new TimeoutWarning(mockModule).closeDialog()).toBe(undefined)

    mockModule = {
      ...mockModule,
      open: 'mock-module-open',
      close: jest.fn(() => {})
    }

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      setAttribute: (paramA, paramB) => {},
      classList: {
        remove: (addParam) => null
      }
    }))
    expect(new TimeoutWarning(mockModule).closeDialog()).toBe(undefined)
  })

  it('test TimeoutWarning.clearTimers', () => {
    expect(new TimeoutWarning(mockModule).clearTimers()).toBe(undefined)
  })

  // not a great test, need to test the function inside the listener somehow.
  // on the plus side, the listener itself works
  it('test TimeoutWarning.disableBackButtonWhenOpen()', () => {
    mockModule = origMockModule
    let timeoutInstance = new TimeoutWarning(mockModule)

    const spy = jest.spyOn(window, 'addEventListener')

    timeoutInstance.disableBackButtonWhenOpen()

    expect(spy).toHaveBeenCalled()
    expect(spy).toBeCalledWith('popstate', expect.any(Function))

  })

  it('test TimeoutWarning.escClose()', () => {
    const param = {}
    mockModule = origMockModule
    expect(new TimeoutWarning(mockModule).escClose(param)).toBe(undefined)

    mockModule = {
      ...mockModule,
      open: 'mock-module-open',
      close: jest.fn(() => {})
    }
    param.keyCode = 27
    expect(new TimeoutWarning(mockModule).escClose(param)).toBe(undefined)
  })

  it('test TimeoutWarning.setLastActiveTimeOnServer()', () => {
    const result = new TimeoutWarning(mockModule)
    expect(result).toBeDefined()
    expect(result.setLastActiveTimeOnServer()).toBe(0)
  })

  it('test TimeoutWarning.checkIfShouldHaveTimedOut', () => {
    let timeoutInstance = new TimeoutWarning(mockModule)
    timeoutInstance.redirect.bind = jest.fn();

    const pastTime = new Date(new Date() - (timeoutInstance.idleMinutesBeforeTimeOut * 60 + 1) * 1000);
    const recentTime = new Date(new Date() - (timeoutInstance.idleMinutesBeforeTimeOut * 60 - 1) * 1000);
    
    let getItemMock = pastTime.toString();
    delete window.localStorage;

    window.localStorage = { getItem: getItemMock}
    window.localStorage.getItem = jest.fn(() => pastTime.toString())

    timeoutInstance.checkIfShouldHaveTimedOut();
    expect(timeoutInstance.redirect.bind).toHaveBeenCalled();

    delete window.localStorage

    getItemMock = recentTime.toString();
    window.localStorage = { getItem: getItemMock}
    window.localStorage.getItem = jest.fn(() => recentTime.toString())

    timeoutInstance.checkIfShouldHaveTimedOut();
    expect(timeoutInstance.redirect.bind).toHaveBeenCalledTimes(1);

    delete window.localStorage
    window.localStorage = null

    expect(timeoutInstance.redirect.bind).toHaveBeenCalledTimes(1);


  })

  it('test TimeoutWarning.redirect', () => {
    const replaceMock = jest.fn();
    delete window.location;

    window.location = { replace: replaceMock };
    
    new TimeoutWarning(mockModule).redirect()
    expect(replaceMock).toHaveBeenCalled()
  })

})
