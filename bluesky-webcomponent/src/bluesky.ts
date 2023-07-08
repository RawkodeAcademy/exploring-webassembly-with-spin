import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'my-bluesky': MyElement;
  }
}

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-bluesky')
export class MyElement extends LitElement {
  @property()
  link: string = "";

  @property()
  fetched: boolean = false;

  @property()
  displayName: string = "";

  @property()
  avatar: string = "";

  @property()
  handle: string = "";

  @property()
  post: string = "";

  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  onInput(e: Event) {
    const inputEl = e.target as HTMLInputElement;
    this.link = inputEl.value;
  }

  override render() {
    console.log("rendering")

    return html`
      <h1>Skies are Blue</h1>

      <input @input=${this.onInput} type="text" placeholder="Link" .value=${this.link}/>

      <button @click=${this.embedLink} part="button">
        Embed
      </button>

      ${this.renderEmbed()}
  `;
  }

  private renderEmbed() {
    if (this.fetched) {
      console.log("rendering embed");
      return html`
      <h2>${this.displayName} said ...</h2>
      <h3>at://${this.handle}</h3>
      <img src="${this.avatar}" width="64" height="64" />
      <p>
        ${this.post}
      </p>
      `
    }

    return html``;
  }

  async embedLink() {
    const data = await fetch("https://backend-zkmklmnd.fermyon.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "link": this.link,
      })
    });

    const json = await data.json();

    //{ thread: { post: { author: { avatar: string, displayName: string, handle: string }, record: { text: string } } } }
    this.displayName = json.thread?.post?.author?.displayName;
    this.avatar = json.thread?.post?.author?.avatar;
    this.handle = json.thread?.post?.author?.handle || "Unknown";
    this.post = json.thread?.post?.record?.text;
    this.fetched = true;
  }
}
