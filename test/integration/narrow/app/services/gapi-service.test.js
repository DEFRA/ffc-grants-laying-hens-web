const { sendGAEvent, isBlockDefaultPageView } = require('./../../../../../app/services/gapi-service')

const appInsights = require('./../../../../../app/services/app-insights'); // replace with actual path

jest.mock('./../../../../../app/services/app-insights'); // replace with actual path

describe('isBlockDefaultPageView', () => {
    it('should return true for blocked URLs', () => {
      expect(isBlockDefaultPageView('/login')).toBe(true);
      expect(isBlockDefaultPageView('/start')).toBe(true);
    });
  
    it('should return false for non-blocked URLs', () => {
      expect(isBlockDefaultPageView('/non-blocked-url')).toBe(false);
    });
});
    
describe('sendGAEvent', () => {
    let request;
    let metrics;
    let gaViewMock;
  
    beforeEach(() => {
      gaViewMock = jest.fn();
      request = {
        route: { path: '/test' },
        info: { hostname: 'localhost' },
        ga: { view: gaViewMock },
      };
      metrics = { name: 'eligibility_passed', params: {} };
    });
  
    it('should send the correct event', async () => {
      await sendGAEvent(request, metrics);
      expect(gaViewMock).toHaveBeenCalledWith(request, [{ name: metrics.name, params: expect.any(Object) }]);
    });
  
    it('should log an exception if sending the event fails', async () => {
      gaViewMock.mockImplementationOnce(() => { throw new Error('Test error'); });
      await sendGAEvent(request, metrics);
      expect(appInsights.logException).toHaveBeenCalledWith(request, { error: expect.any(Error) });
    });
  });