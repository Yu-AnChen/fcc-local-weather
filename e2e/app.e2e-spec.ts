import { FccShowTheLocalWeatherPage } from './app.po';

describe('fcc-show-the-local-weather App', () => {
  let page: FccShowTheLocalWeatherPage;

  beforeEach(() => {
    page = new FccShowTheLocalWeatherPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
