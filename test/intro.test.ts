import { introError } from '../source/errors';
import Page, { intro } from '../source/page';
import * as request from '../source/request';
import wiki from "../source/index";
import * as utils from '../source/utils'
import { pageJson } from './samples';
const requestMock = jest.spyOn(request, "default");
const setTitleMock = jest.spyOn(utils, "setTitleForPage");

const introMock = {
    500: { extract: "This is a test intro" }
}

const introResult = "This is a test intro"

afterAll(() => {
    requestMock.mockRestore();
    setTitleMock.mockRestore();
})

test('Intro method on page object returns without calling request if _intro field set', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: introMock } } });
    const page = new Page(pageJson);
    page._intro = "test intro"
    const result = await page.intro();
    expect(requestMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(page._intro);
});

test('Intro method on page object returns intro', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: introMock } } });
    const page = new Page(pageJson);
    const result = await page.intro({redirect: true});
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(introResult);
});

test('intro method on page throws intro error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const page = new Page(pageJson);
    const t = async () => {
        await page.intro();
    };
    expect(t).rejects.toThrowError(introError);
});

test('Throws intro error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const t = async () => {
        await intro("Test")
    };
    expect(t).rejects.toThrowError(introError);
});

test('Returns with results as string', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: introMock } } });
    const result = await intro("Test");
    expect(result).toStrictEqual(introResult);
});

test('intro method on index throws intro error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const t = async () => {
        await wiki.intro("Test")
    };
    expect(t).rejects.toThrowError(introError);
});

test('Intro method on index returns a string', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: introMock } } });
    const result = await wiki.intro("Test");
    expect(setTitleMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(introResult);
});

test('Intro method on index returns a string even when autosuggest is true', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: introMock } } });
    setTitleMock.mockImplementation(async () => { return "test" });
    const result = await wiki.intro("Test", { autoSuggest: true });
    expect(setTitleMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(introResult);
});