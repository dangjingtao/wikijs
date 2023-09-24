import { imageError } from '../source/errors';
import Page, { images } from '../source/page';
import * as request from '../source/request';
import wiki from "../source/index";
import * as utils from '../source/utils'
import { pageJson } from './samples';
const requestMock = jest.spyOn(request, "default");
const setTitleMock = jest.spyOn(utils, "setTitleForPage");

const imageMock = {
    500: { pageid: 500, ns: 0, title: 'test', imagerepository: 'testRepo', imageinfo: [{ url: 'testUrl' }] },
    501: { pageid: 501, ns: 1, title: 'test', imagerepository: 'testRepo', imageinfo: [{ url: "testUrl" }] }
}

const imageResult = [{ pageid: 500, ns: 0, title: 'test', imagerepository: 'testRepo', imageinfo: [{ url: 'testUrl' }], url: 'testUrl' },
{ pageid: 501, ns: 1, title: 'test', imagerepository: 'testRepo', imageinfo: [{ url: 'testUrl' }], url: 'testUrl' }]

afterAll(() => {
    requestMock.mockRestore();
    setTitleMock.mockRestore();
})

test('Image method on page object returns without calling request if _images field set', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: imageMock } } });
    const page = new Page(pageJson);
    page._images = []
    const result = await page.images();
    expect(requestMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual([]);
});

test('Image method on page object returns array of images', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: imageMock } } });
    const page = new Page(pageJson);
    const result = await page.images();
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(imageResult);
});

test('images method on page throws image error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const page = new Page(pageJson);
    const t = async () => {
        await page.images();
    };
    expect(t).rejects.toThrowError(imageError);
});

test('Throws image error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const t = async () => {
        await images("Test")
    };
    expect(t).rejects.toThrowError(imageError);
});

test('Returns empty if no images are available', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: {} } } });
    const result = await images("Test");
    expect(result).toStrictEqual([]);
});

test('Returns with results an array of imageResult object', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: imageMock } } });
    const result = await images("Test");
    expect(result).toStrictEqual(imageResult);
});

test('image method on index throws image error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const t = async () => {
        await wiki.images("Test")
    };
    expect(t).rejects.toThrowError(imageError);
});


test('Image method on index returns array of images', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: imageMock } } });
    const result = await wiki.images("Test");
    expect(setTitleMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(imageResult);
});

test('Image method on index returns array of images even when autosuggest is true', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: imageMock } } });
    setTitleMock.mockImplementation(async () => { return "test" });
    const result = await wiki.images("Test", { autoSuggest: true });
    expect(setTitleMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(imageResult);
});