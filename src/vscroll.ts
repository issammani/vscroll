export interface VScrollProps {
  container: HTMLElement;
  containerSize?: number;
  rowSize: number;
  numberOfRows: number;
  overscanBy: number;
  onRow: (index: number) => string;
}

export const DEFAULT_PROPS: Partial<VScrollProps> = {
  overscanBy: 2,
  containerSize: 0,
};

export class VScroll {
  private options: VScrollProps;
  private scrollSize: number;

  private wrapper: HTMLElement;
  private content: HTMLElement;
  private shift: HTMLElement;

  constructor(options: VScrollProps) {
    // TODO: validate options and throw error if invalid
    this.options = { ...DEFAULT_PROPS, ...options };
    this.scrollSize = this.options.rowSize * this.options.numberOfRows;
    console.log(`${this.scrollSize} vs ${this._getMaxBrowserScrollSize()}`);
    this.render = this.render.bind(this);

    this.setup();
  }

  setup() {
    this.options.container.innerHTML = `<div class="wrapper"><div class="content"><div class="shift"></div></div></div>`;

    this.wrapper = this.options.container.querySelector(".wrapper");
    this.content = this.options.container.querySelector(".content");
    this.shift = this.options.container.querySelector(".shift");

    this.wrapper.style.height = `${this.options.containerSize}px`;
    this.content.style.height = `${this.scrollSize}px`;

    this.wrapper.addEventListener("scroll", this.render, { passive: true });
    this.render();
  }

  _getMaxBrowserScrollSize() {
    const sizeMeasurer = document.createElement("div");
    sizeMeasurer.style.opacity = "0";
    sizeMeasurer.style.position = "absolute";
    sizeMeasurer.style.left = `${Number.MAX_SAFE_INTEGER}px`;
    sizeMeasurer.style.top = `height: ${Number.MAX_SAFE_INTEGER}px`;
    document.body.appendChild(sizeMeasurer);

    const { left, top } = sizeMeasurer.getBoundingClientRect();
    document.body.removeChild(sizeMeasurer);
    return { left, top };
  }

  render() {
    let startIndex =
      Math.floor(this.wrapper.scrollTop / this.options.rowSize) -
      this.options.overscanBy;
    startIndex = Math.max(0, startIndex);

    let renderItemsCount =
      Math.floor(this.options.containerSize / this.options.rowSize) +
      2 * this.options.overscanBy;
    renderItemsCount = Math.min(
      this.options.numberOfRows - startIndex,
      renderItemsCount
    );

    // TODO: Make this generic so that it can be used for any scroll direction
    const verticalShift = this.options.rowSize * startIndex;

    const visibleItems = [...Array(renderItemsCount)].map((_, index) =>
      this.options.onRow(index + startIndex)
    );

    this.shift.style.transform = `translateY(${verticalShift}px)`;
    this.shift.innerHTML = `${visibleItems.join("")}`;
  }
}

export default VScroll;
