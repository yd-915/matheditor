import { API, BlockAPI, BlockTool, BlockToolConstructorOptions, BlockToolData, ToolConfig } from '@editorjs/editorjs';
import { MathfieldElement } from 'mathlive';
import 'mathlive/dist/mathlive-fonts.css';
import 'mathlive/dist/mathlive.min';

export default class MathBlock implements BlockTool {
  api: API;
  data: BlockToolData;
  config?: ToolConfig;
  block?: BlockAPI;
  readOnly: boolean;
  mathfield: MathfieldElement;
  settingsButtons: HTMLElement[];

  static get toolbox() {
    return {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
      <path d="M15.6622 4.83C15.4443 4.43945 14.9352 4.32515 14.5713 4.5851L14.186 4.8603C13.8489 5.10105 13.3805 5.02299 13.1398 4.68593C12.899 4.34887 12.9771 3.88045 13.3141 3.6397L13.6994 3.3645C14.7912 2.58467 16.3185 2.92754 16.9721 4.09921L17.6411 5.29833L19.7197 3.21967C20.0126 2.92677 20.4875 2.92677 20.7804 3.21967C21.0733 3.51256 21.0733 3.98743 20.7804 4.28033L18.4007 6.66L19.2856 8.24622C19.5126 8.65299 20.0515 8.7567 20.4132 8.46322L20.7775 8.16761C21.0991 7.90661 21.5715 7.95578 21.8324 8.27743C22.0934 8.59907 22.0443 9.0714 21.7226 9.33239L21.3583 9.628C20.2733 10.5085 18.6565 10.1973 17.9757 8.97701L17.2982 7.76255L15.2804 9.78033C14.9875 10.0732 14.5126 10.0732 14.2197 9.78033C13.9268 9.48743 13.9268 9.01256 14.2197 8.71967L16.5385 6.40087L15.6622 4.83Z" fill="#212121"/>
      <path d="M8.34835 13.8922C6.89604 14.1756 5.25531 14.2384 3.67207 14.2484C3.32888 15.4975 3.43407 16.407 3.73871 17.0356C4.07937 17.7386 4.73159 18.2194 5.611 18.4387C7.40941 18.8874 9.9779 18.1758 11.6859 16.227C11.9589 15.9155 12.4328 15.8843 12.7443 16.1573C13.0558 16.4304 13.087 16.9042 12.814 17.2157C10.772 19.5456 7.64317 20.4917 5.24793 19.8941C4.03052 19.5904 2.96183 18.8721 2.38886 17.6898C1.81935 16.5145 1.80262 15.0113 2.41127 13.2545C3.23467 10.8778 4.48257 9.40236 5.72896 8.48846C6.96797 7.57996 8.16564 7.25537 8.84942 7.11529C10.4045 6.79672 11.7563 7.24025 12.5001 8.21665C13.2539 9.20604 13.2405 10.5633 12.4051 11.7043C11.4811 12.9663 9.95734 13.5781 8.34835 13.8922ZM9.15047 8.58477C8.58425 8.70077 7.61692 8.96415 6.61593 9.69812C5.79267 10.3018 4.91895 11.2439 4.23027 12.7421C5.5922 12.7203 6.90768 12.6451 8.061 12.42C9.5385 12.1316 10.6048 11.624 11.1948 10.8182C11.6835 10.1507 11.6129 9.52728 11.3069 9.12564C10.9911 8.71102 10.2809 8.35319 9.15047 8.58477Z" fill="#212121"/>
      </svg>`,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api, readOnly }: BlockToolConstructorOptions) {
    this.api = api;
    this.settingsButtons = [];
    this.readOnly = readOnly;
    this.data = {
      value: data.value,
      defaultMode: data.defaultMode || config.mode,
    };
    this.config = config;
    this.block = api.blocks.getBlockByIndex(api.blocks.getCurrentBlockIndex()) as BlockAPI;
    this.mathfield = new MathfieldElement();
  }

  render() {
    this.mathfield.contentEditable = "true";
    this.mathfield.virtualKeyboardMode = "onfocus";
    this.mathfield.virtualKeyboardTheme = "material";
    // eslint-disable-next-line no-useless-escape
    this.mathfield.mathModeSpace = "\\,"
    this.mathfield.readOnly = this.readOnly;
    this.mathfield.value = this.data.value;
    this.mathfield.defaultMode = this.data.defaultMode;
    this.mathfield.oninput = this.block!.dispatchChange;
    this.mathfield.smartMode = true;
    this.mathfield.keypressSound = "none";
    this.mathfield.plonkSound = "none";
    this.mathfield.addEventListener('mount', this.mathfield.focus);
    this.mathfield.addEventListener('keystroke', e => e.detail.keystroke === '[Enter]' && this.api.blocks.insert("math"));
    this.mathfield.addEventListener('focus-out', (e) => {
      if (e.detail.direction === 'forward' && !this.mathfield.closest('.ce-block')!.nextElementSibling) {
        e.preventDefault();
        this.api.blocks.insert("math");
      }
    });
    const CSS = `.ML__fieldcontainer__field {
      justify-content: var(--justify-content);
    }`;
    const mathfield_style = this.mathfield.shadowRoot!.querySelector('style');
    mathfield_style?.append(CSS);

    return this.mathfield;
  }

  renderSettings() {
    const holder = document.createElement('DIV');
    const computeButton = document.createElement('SPAN');
    computeButton.classList.add("cdx-math", this.api.styles.settingsButton);
    computeButton.innerHTML = `<svg viewBox="0 0 20 20" height="28"><path d="M15.33 10l2.17-2.47-3.19-.71.33-3.29-3 1.33L10 2 8.35 4.86l-3-1.33.32 3.29-3.17.71L4.67 10 2.5 12.47l3.19.71-.33 3.29 3-1.33L10 18l1.65-2.86 3 1.33-.32-3.29 3.19-.71zm-2.83 1.5h-5v-1h5zm0-2h-5v-1h5z" fill="#f96932"></path></svg>`
    computeButton.addEventListener('click', () => {
      const value = this.mathfield.getValue(this.mathfield.selection) || this.mathfield.value;
      window.open(`https://www.wolframalpha.com/input/?i=${encodeURIComponent(value)}`);
    });

    const mathModeButton = document.createElement('SPAN');
    mathModeButton.classList.add(this.api.styles.settingsButton);
    if (this.data.defaultMode === "inline-math") {
      mathModeButton.classList.add(this.api.styles.settingsButtonActive);
    }
    mathModeButton.innerHTML = `<svg viewBox="0 0 48 48" height="24"><path d="M24 42 16 34 18.2 31.8 22.5 36.1V11.9L18.2 16.2L16 14L24 6L32 14L29.8 16.2L25.5 11.9V36.1L29.8 31.8L32 34Z"/></svg>`;
    mathModeButton.addEventListener('click', () => {
      const mode = this.data.defaultMode === "inline-math" ? "math" : "inline-math";
      this.data.defaultMode = mode;
      this.mathfield.defaultMode = mode as "math" | "inline-math" | "text";
      mathModeButton.classList.toggle(this.api.styles.settingsButtonActive);
      this.block!.dispatchChange();
    });

    holder.appendChild(computeButton);
    holder.appendChild(mathModeButton);

    this.settingsButtons.push(computeButton, mathModeButton);
    return holder;
  }

  rendered() {
    setTimeout(() => {
      this.mathfield.removeAttribute("contenteditable");
    }, 0);
  }

  save() {
    return { value: this.mathfield.value, defaultMode: this.mathfield.defaultMode };
  }

}