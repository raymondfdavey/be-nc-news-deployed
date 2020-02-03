const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns a new empty array when passed an empty array", () => {
    const input = [];
    const output = formatDates(input);
    expect(output).to.eql([]);
    expect(output).to.not.equal(input);
  });
  it("returns a new array with a new object identical to the one passed except the datestamp is reformatted into javascript date object", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(input);
    expect(output[0].created_at).to.eql(new Date(1542284514171));
  });
  it("returns a new array with a new object identical to the one passed except the datestamp is reformatted into javascript date object for multiple object in an array", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      }
    ];
    const output = formatDates(input);
    output.forEach((item, i) => {
      expect(item.created_at).to.eql(new Date(input[i].created_at));
    });
  });
});

describe("makeRefObj", () => {
  it("creates a reference object from one object in an array", () => {
    const input = [
      {
        article_id: 12,
        title: "Moustache",
        body: "Have you seen the size of that thing?",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge"
      }
    ];
    const output = makeRefObj(input);
    expect(output).to.eql({ 12: "Moustache" });
  });
  it("creates a reference object from many objects in an array", () => {
    const input = [
      {
        article_id: 12,
        title: "Moustache",
        body: "Have you seen the size of that thing?",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge"
      },
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        body: "some gifs",
        votes: 0,
        topic: "mitch",
        author: "icellusedkars"
      },
      {
        article_id: 4,
        title: "Student SUES Mitch!",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        votes: 0,
        topic: "mitch",
        author: "rogersop"
      },
      {
        article_id: 5,
        title: "UNCOVERED: catspiracy to bring down democracy",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        votes: 0,
        topic: "cats",
        author: "rogersop"
      }
    ];
    const output = makeRefObj(input);
    expect(output).to.eql({
      12: "Moustache",
      3: "Eight pug gifs that remind me of mitch",
      4: "Student SUES Mitch!",
      5: "UNCOVERED: catspiracy to bring down democracy"
    });
  });
});

describe("formatComments", () => {
  it("returns an new empty array if passed and empty array", () => {
    const input = [];
    const output = formatComments(input);
    expect(output).to.eql([]);
    expect(output).to.not.equal(input);
  });
  it("takes an array with a single object with a created_by key and changes it to an author key with the same value", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const output = formatComments(input);
    expect(output[0].author).to.eql("butter_bridge");
    expect(output[0].created_by).to.eql(undefined);
  });
  it("instead of a belongs_to key, it has an article_id key set to the article id that corresponds to the title on the original object", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const refObj = {
      "1": "Living in the shadow of a great man",
      "2": "Sony Vaio; or, The Laptop"
    };
    const output = formatComments(input, refObj);
    expect(output).to.eql([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ]);
  });
  it("converts the created_at value into a valid javascript date object", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const refObj = {
      "1": "Living in the shadow of a great man",
      "2": "Sony Vaio; or, The Laptop"
    };
    const output = formatComments(input, refObj);
    expect(output[0].created_at).to.eql(new Date(1479818163389));
  });
  it("does not mutate the original object or array", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const refObj = {
      "1": "Living in the shadow of a great man",
      "2": "Sony Vaio; or, The Laptop"
    };
    const output = formatComments(input, refObj);
    expect(output).to.not.equal(input);
    expect(output[0]).to.not.equal(input[0]);
  });
  it("impliments above functionality on multiple objects in an array", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];
    const refObj = {
      "1": "Living in the shadow of a great man",
      "2": "Sony Vaio; or, The Laptop",
      "3": "Eight pug gifs that remind me of mitch",
      "4": "Student SUES Mitch!",
      "5": "UNCOVERED: catspiracy to bring down democracy",
      "6": "A",
      "7": "Z",
      "8": "Does Mitch predate civilisation?",
      "9": "They're not exactly dogs, are they?",
      "10": "Seven inspirational thought leaders from Manchester UK",
      "11": "Am I a cat?",
      "12": "Moustache"
    };
    const output = formatComments(input, refObj);
    expect(output).to.eql([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 1,
        author: "icellusedkars",
        votes: 100,
        created_at: new Date(1448282163389)
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        article_id: 1,
        author: "icellusedkars",
        votes: -100,
        created_at: new Date(1416746163389)
      }
    ]);
  });
});
