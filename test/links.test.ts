import { linksError } from '../source/errors';
import Page, { links } from '../source/page';
import * as request from '../source/request';
import wiki from "../source/index";
import * as utils from '../source/utils'
import { pageJson } from './samples';
const requestMock = jest.spyOn(request, "default");
const setTitleMock = jest.spyOn(utils, "setTitleForPage");

const linkMock = {
    500: { links: [{title:"Link1"}, {title: "Link2"}] }
}

const linkResult = ["Link1", "Link2"]

afterAll(() => {
    requestMock.mockRestore();
    setTitleMock.mockRestore();
})

test('Links method on page object returns without calling request if _links field set', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: linkMock } } });
    const page = new Page(pageJson);
    page._links = []
    const result = await page.links();
    expect(requestMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(page._links);
});

test('link method on page object returns array of strings', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: linkMock } } });
    const page = new Page(pageJson);
    const result = await page.links();
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(linkResult);
});

test('links method on page throws links error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const page = new Page(pageJson);
    const t = async () => {
        await page.links()
    };
    expect(t).rejects.toThrowError(linksError);
});

test('Throws links error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const t = async () => {
        await links("Test")
    };
    expect(t).rejects.toThrowError(linksError);
});

test('Returns empty if no links are available', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: {500: {links:[]}} } } });
    const result = await links("Test");
    expect(result).toStrictEqual([]);
});

test('Returns with results an array of string', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: linkMock } } });
    const result = await links("Test");
    expect(result).toStrictEqual(linkResult);
});

test('links method on page throws links error if response is empty', async () => {
    requestMock.mockImplementation(async () => { return [] });
    const t = async () => {
        await wiki.links("Test")
    };
    expect(t).rejects.toThrowError(linksError);
});

test('links method on index returns array of strings', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: linkMock } } });
    const result = await wiki.links("Test");
    expect(setTitleMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(linkResult);
});

test('links method on index returns array of strings even when autosuggest is true', async () => {
    requestMock.mockImplementation(async () => { return { query: { pages: linkMock } } });
    setTitleMock.mockImplementation(async () => { return "test" });
    const result = await wiki.links("Test", { autoSuggest: true });
    expect(setTitleMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(linkResult);
});