import parse from "node-html-parser";

export default function findInPage(html: string, selector: string) {
  const dom = parse(html.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  const elements = dom.querySelectorAll(selector);

  let returnHTMLData = "";
  elements.forEach((element) => (returnHTMLData += element.outerHTML));

  return returnHTMLData;
}
