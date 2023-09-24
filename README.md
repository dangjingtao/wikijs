# wikijs
基于nodejs的wiki请求,在 git://github.com/dopecodez/wikipedia.git 基础上增加代理。

```javascript

const wiki = require("wiki");
(async () => {
  try {
    await wiki.setLang("zh");
    wiki.setProxy(`http://127.0.0.1:1080`);
    // console.log(newUrl);
    const page = await wiki.page("keyword");
    //Response of type @Page object
    const summary = await page.infobox();
    console.log(summary);
    //Response of type @wikiSummary - contains the intro and the main image
  } catch (error) {
    console.log(error);
    //=> Typeof wikiError
  }
})();



```

