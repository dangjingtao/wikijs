# Result Types

## Highlights

- [wikiSummary](#wikiSummary)
- [imageResult](#imageResult)
- [coordinatesResult](#coordinatesResult)
- [langLinksResult](#langLinksResult)
- [wikiSearchResult](#wikiSearchResult)
- [geoSearchResult](#geoSearchResult)
- [languageResult](#languageResult)
- [wikiMediaResult](#wikiMediaResult)
- [eventResult](#eventResult)
- [fcResult](#fcResult)
- [relatedResult](#relatedResult)
- [titleItem](#titleItem)
- [mobileSections](#mobileSections)

### wikiSummary

The wiki summary for the page.

```js
interface wikiSummary {
  type: string,
  title: string, // title of the page
  displaytitle: string, // title of the page
  namespace: { id: number, text: string },
  wikibase_item: string,
  titles: { canonical: string, normalized: string, display: string },
  pageid: number, // page Id
  thumbnail: { // Thumbnail for the page
    source: string,
    width: number,
    height: number
  },
  originalimage: {
    source: string,
    width: number,
    height: number
  },
  lang: string,
  dir: string,
  revision: string,
  tid: string,
  timestamp: string,
  description: string,
  description_source: string,
  content_urls: { // The urls will be here
    desktop: {
      page: string,
      revisions: string,
      edit: string,
      talk: string
    },
    mobile: {
      page: string,
      revisions: string,
      edit: string,
      talk: string
    }
  },
  extract: string,
  extract_html: string,
  normalizedtitle?: string,
  coordinates?: {
    lat: number,
    lon: number
  }
}
```

### imageResult

The image result for the page.

```js
interface imageResult {
  pageid: number,
  ns: number,
  title: string,
  imagerepository: string,
  imageinfo: any,
  url: string // This will contain the image url
}
```

### coordinatesResult

The coordinates result.
```js
interface coordinatesResult {
  lat: number //latitude
  lon: number, //longitude
  primary: string,
  globe: string // The globe ie Earth!
}
```

### langLinksResult

The lang links result

```js
interface langLinksResult {
  lang: string, //language code
  title: string, // The title of the page
  url: string // url of the page
}
```

### wikiSearchResult

The search result. The autosuggest will be populated or null based on input params.

```js
interface wikiSearchResult {
  results: any[], // the search results as an array
  suggestion: string // the suggestion string if suggestion option is set to true
}
```
### geoSearchResult

The geosearch result.

```js
interface geoSearchResult {
  pageid: number, // the page id. use this or title for further requests
  ns: number,
  title: string, // the title. use this or pageid for further requests
  lat: number, // the page latitude
  lon: number, // the page longitude
  dist: number,
  primary: string,
  type: string // the type of the page eg: city, museum
}
```
### languageResult

```js
interface languageResult {
  [key: string]: string // key will be the language code to be used in setLang(key), and the value will be the full url
}
```

### wikiMediaResult

```js
interface wikiMediaResult {
  revision: string, // the revision id of the page
  tid: string,
  items: Array<mediaResult> // contains an array of media results
}

interface mediaResult {
  title: string, // title of image
  section_id: number, // section where image is present
  type: string, // type of media - can be image, video, or audio
  caption?: { // will be undefined for the infobox images
    html: string, // the html of the caption
    text: string // the text you probably want to use
  },
  showInGallery: boolean,
  srcset: Array<srcResult> // this contains the url for the media
}

interface srcResult {
  src: string, // the url for the media
  scale: string
}
```

### eventResult

The result for the `onThisDay` function call.
```js
interface eventResult {
  births?: [
    {
      text: string,
      pages: Array<wikiSummary>,
      year?: number
    }
  ],
  deaths?: [
    {
      text: string,
      pages: Array<wikiSummary>,
      year?: number
    }
  ],
  events?: [
    {
      text: string,
      pages: Array<wikiSummary>,
      year?: number
    }
  ],
  holidays?: [
    {
      text: string,
      pages: Array<wikiSummary>
    }
  ],
  selected?: [
    {
      text: string,
      pages: Array<wikiSummary>,
      year?: number
    }
  ]
}
```

### fcResult

The result for the `featuredContent` function call.
```js
interface fcResult {
  tfa: wikiSummary;
  mostread: {
    date: string;
    articles: Array<wikiSummary>
  };
  image: {
    title: string;
    thumbnail: {
      source: string;
      width: number;
      height: number;
    };
    image: {
      source: string;
      width: number;
      height: number;
    };
    file_page: string;
    artist: Artist;
    credit: htmlText;
    license: {
      type: string;
      code: string;
    };
    description: Description;
    wb_entity_id: string;
    structured: {
      captions: {
        [key: string]: string;
      }
    };
  };
  news: [
    {
      links: Array<wikiSummary>;
      story: string;
    }
  ];
  onthisday: [
    {
      text: string;
      pages: Array<wikiSummary>;
      year: number;
    }
  ]
}
```

### relatedResult

The related result.
```js
interface relatedResult {
  pages: Array<wikiSummary>
}
```

### titleItem

The title item object for the page
```js
interface titleItem {
  title: string,
  page_id: number,
  rev: number,
  tid: number,
  namespace: number,
  user_id: number,
  user_text: string,
  timestamp: string,
  comment: string,
  tags: Array<string>,
  restrictions: Array<string>,
  page_language: string,
  redirect: boolean
}

// The result for the random titles query
interface title {
  items: Array<titleItem>
}
```

### mobileSections

The mobile sections for the page

```js
interface mobileSections {
  lead: {
    ns: number,
    id: number,
    revision: string,
    lastmodified: string,
    lastmodifier: {
      user: string,
      gender: string
    },
    displaytitle: string,
    normalizedtitle: string,
    wikibase_item: string,
    description: string,
    description_source: string,
    protection: Record<string, unknown>,
    editable: boolean,
    languagecount: number,
    image: {
      file: string,
      urls: {
        320: string,
        640: string,
        800: string,
        1024: string
      }
    },
    issues: Array<htmlText>,
    geo?: {
      latitude: string,
      longitude: string
    }
    sections: Array<section>
  },
  remaining: {
    sections: Array<section>
  }
}

interface section {
  id: number,
  text: string,
  toclevel: number,
  line: string,
  anchor: string
}
```