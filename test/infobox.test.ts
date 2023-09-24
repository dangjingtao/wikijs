import { infoboxError } from '../source/errors';
import Page, { infobox, rawInfo } from '../source/page';
import * as request from '../source/request';
import wiki from "../source/index";
import * as utils from '../source/utils'
import { pageJson, rawJson } from './samples';
const requestMock = jest.spyOn(request, "default");
const setTitleMock = jest.spyOn(utils, "setTitleForPage");

const rawResult= rawJson['*'];
const rawMock = { 500: { revisions: [rawJson] } };

const infoboxResult = {
    name: 'Linus Torvalds',
    image: 'LinuxCon Europe Linus Torvalds 03 (cropped).jpg',
    caption: 'Torvalds at LinuxCon Europe 2014'
}

afterAll(() => {
    requestMock.mockRestore();
    setTitleMock.mockRestore();
})

test('infobox method on page object returns without calling request if _infobox field set', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: rawMock } } });
    const page = new Page(pageJson);
    page._infobox = infoboxResult;
    const result = await page.infobox();
    expect(requestMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(page._infobox);
});

test('Infobox method on page object returns infobox', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: rawMock } } });
    const page = new Page(pageJson);
    const result = await page.infobox({redirect: true});
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(infoboxResult);
});

test('infobox method on page throws infobox error if response is error', async () => {
    requestMock.mockImplementation(async () => { throw new Error("This is an error") });
    const page = new Page(pageJson);
    const t = async () => {
        await page.infobox();
    };
    expect(t).rejects.toThrowError(infoboxError);
});

test('Throws infobox error if response is error', async () => {
    requestMock.mockImplementation(async () => { throw new Error("This is an error") });
    const t = async () => {
        await infobox("Test")
    };
    expect(t).rejects.toThrowError(infoboxError);
});

test('Returns with results as any', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: rawMock } } });
    const result = await infobox("Test", true);
    expect(result).toStrictEqual(infoboxResult);
});

test('infobox method on index throws infobox error if response is error', async () => {
    requestMock.mockImplementation(async () => { throw new Error("This is an error") });
    const t = async () => {
        await wiki.infobox("Test")
    };
    expect(t).rejects.toThrowError(infoboxError);
});

test('infobox method on index returns infobox', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: rawMock } } });
    const result = await wiki.infobox("Test");
    expect(setTitleMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(infoboxResult);
});

test('infobox method on index returns a infobox even when autosuggest is true', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: rawMock } } });
    setTitleMock.mockImplementation(async () => { return "test" });
    const result = await wiki.infobox("Test", { autoSuggest: true });
    expect(setTitleMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(infoboxResult);
});

test('rawinfo method returns a string', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: rawMock } } });
    const result = await rawInfo("Test", {});
    expect(result).toStrictEqual(rawResult);
});

test('rawinfo method returns empty if * field is not present', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: { 500: { revisions: {} } } } } });
    const result = await rawInfo("Test", {});
    expect(result).toStrictEqual('');
});

test('rawinfo method throws an error', async () => {
    requestMock.mockImplementation(async () => { return {} });
    const t = async () => {
        await rawInfo("Test", {})
    };
    expect(t).rejects.toThrowError(infoboxError);
});