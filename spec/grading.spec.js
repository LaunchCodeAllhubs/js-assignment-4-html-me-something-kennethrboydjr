// Set up JSDom
const fs = require('fs');
const path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const options = {
   runScripts: "dangerously",
   resources: "usable",
   pretendToBeVisual: true
}

let html = fs.readFileSync(path.resolve(__dirname, "../index.html"), 'utf8');
let css = fs.readFileSync(path.resolve(__dirname, "../styles.css"), 'utf8');

describe("Grading Tests: ", function () {

   let window, container;

   beforeAll(function () {

      const dom = new JSDOM(html, options);
      window = dom.window;

      let stylesElement = window.document.createElement("style");
      stylesElement.textContent = css;
      window.document.head.appendChild(stylesElement);

      window.addEventListener("load", function () {
         container = window.document;
      });
   });

   it("HTML includes the correct number of certain elements", function () {
      let pElements = container.body.getElementsByTagName("p").length;
      let headerElements = container.body.getElementsByTagName("header").length;
      let footerElements = container.body.getElementsByTagName("footer").length;
      let mainElements = container.body.getElementsByTagName("main").length;
      let articleElements = container.body.getElementsByTagName("article").length;
      let imageElements = container.body.getElementsByTagName("img").length;

      expect(pElements).toBeGreaterThanOrEqual(1);
      expect(headerElements).toBeGreaterThanOrEqual(1);
      expect(footerElements).toBeGreaterThanOrEqual(1);
      expect(mainElements).toBeGreaterThanOrEqual(1);
      expect(articleElements).toBeGreaterThanOrEqual(1);
      expect(imageElements).toBeGreaterThanOrEqual(1);
   })

   it("HTML contains correct number of sections", function () {
      let childrenElements = container.body.children;

      expect(childrenElements.length).toBeGreaterThanOrEqual(3);
      expect(childrenElements.length).toBeLessThanOrEqual(10);
   })

   it("HTML includes external CSS script", function () {
      let linkElement = container.getElementsByTagName("link");
      expect(linkElement.item(0).href.includes('styles.css')).toBeTrue();
   })

   it("CSS body sets margin and display", function () {
      expect(window.getComputedStyle(container.body).display).toEqual("block");
      expect(window.getComputedStyle(container.body).margin).toEqual("8px");
   })

   it("CSS funParagraph class is green", function () {
      let funParagraphElement = container.getElementById("testP");
      expect(window.getComputedStyle(funParagraphElement).color).toEqual("green");
   })

   it("CSS mainHeading id is red", function () {
      let headingElement = container.getElementById("mainHeading");
      expect(window.getComputedStyle(headingElement).color).toEqual("red");
   })

   it("HTML includes HTML entities", function () {
      // Regex pattern: /(&.+;)/ig
      const regex = /(&.+;)/ig;
      expect(html.search(regex)).not.toEqual(-1);
   })
});
