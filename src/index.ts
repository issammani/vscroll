import VScroll from "./vscroll";

const appDiv: HTMLElement = document.querySelector("#app");
const mockRows = [...Array(335545)].map(
  (_, i) => `<div class="row"><p>Item - ${i}</p></div>`
);

new VScroll({
  container: appDiv,
  containerSize: 500,
  rowSize: 100,
  numberOfRows: mockRows.length,
  overscanBy: 10,
  onRow: (index: number) => mockRows[index],
});
