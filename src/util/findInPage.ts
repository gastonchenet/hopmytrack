import parse from "node-html-parser";

export default function findInPage(html: string, selector: string) {
  const dom = parse(html);
  const elements = dom.querySelectorAll(selector);

  let returnHTMLData = "";

  elements.forEach((element) => {
    returnHTMLData += element.outerHTML;
  });

  return returnHTMLData;
}
