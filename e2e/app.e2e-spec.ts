import { OcDatTwoPage } from './app.po';

describe('oc-dat-two App', () => {
  let page: OcDatTwoPage;

  beforeEach(() => {
    page = new OcDatTwoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
