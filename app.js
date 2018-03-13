const req = require('request');
const cheerio = require('cheerio');
let collectedLinks = {
    relativePaths: [],
    absolutePaths: []
};
let $;
let baseURL = '';

class WebCrawler {
    constructor() { 
        this.URL = '';
    }

    getWebInformation(url) {
        this.URL = url;
        baseURL = url;
        var $ = makeRequest(this.URL);
    }
}

const makeRequest = (url) => {
    req(url, (err, res, body) => {
        if (err) {
            return err;
        } else {
            if ( res.statusCode == 200 ) {
                $ = cheerio.load(body);
                console.log(getInternalLinks($));
            }
        }
    });
};

const getInternalLinks = ($) => {
    var links = $("a[href^='http']");
    var httpLinks = $("a[href^='/']");
    links.each((i) => {
        collectedLinks.absolutePaths.push($(links[i]).attr('href'));
    });
    httpLinks.each((i) => {
        collectedLinks.relativePaths.push($(httpLinks[i]).attr('href'));
    });
    editPath();
    return collectedLinks;
};

const editPath = () => {
    for( var i = 0; i < collectedLinks.relativePaths.length; i++) {
        collectedLinks.relativePaths[i] = baseURL + collectedLinks.relativePaths[i];
    }
};

let a = new WebCrawler();
a.getWebInformation("http://www.umsu.ac.id/");