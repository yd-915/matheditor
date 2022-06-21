import 'mathlive/';
import { InlineToolConstructorOptions } from '@editorjs/editorjs';
import { createMathFieldFromScript } from '../helpers';

export default class MathInline implements EditorJS.InlineTool {

  api: EditorJS.API;

  button: HTMLButtonElement;
  script: HTMLScriptElement;
  _state: boolean = false;
  iconClasses: {
    active: string
    base: string
  };
  class = 'cdx-math-inline';

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({ api, config }: InlineToolConstructorOptions) {
    this.api = api;
    this.button = document.createElement('button');
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };
    this.script = document.createElement('script');
    this.script.type = 'math/tex';
  }

  static get isInline() {
    return true;
  }

  render() {
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  surround(range: Range) {
    if (!range) {
      return;
    }

    if (this.state) {
      this.unwrap(range);
    } else {
      this.wrap(range);
    }
  }

  wrap(range: Range) {
    let latex = range.extractContents().textContent as string;
    this.script.textContent = latex;
    range.insertNode(this.script);
    createMathFieldFromScript(this.script, true);
    this.script.insertAdjacentHTML('afterend', '&nbsp;');
  }

  unwrap(range: Range) {
    const mathfield = this.script.previousElementSibling;
    mathfield?.remove();
    range.insertNode(document.createTextNode(this.script.textContent as string));
  }

  checkState(selection: Selection) {
    return false;
  }

  get toolboxIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
    <path d="M15.6622 4.83C15.4443 4.43945 14.9352 4.32515 14.5713 4.5851L14.186 4.8603C13.8489 5.10105 13.3805 5.02299 13.1398 4.68593C12.899 4.34887 12.9771 3.88045 13.3141 3.6397L13.6994 3.3645C14.7912 2.58467 16.3185 2.92754 16.9721 4.09921L17.6411 5.29833L19.7197 3.21967C20.0126 2.92677 20.4875 2.92677 20.7804 3.21967C21.0733 3.51256 21.0733 3.98743 20.7804 4.28033L18.4007 6.66L19.2856 8.24622C19.5126 8.65299 20.0515 8.7567 20.4132 8.46322L20.7775 8.16761C21.0991 7.90661 21.5715 7.95578 21.8324 8.27743C22.0934 8.59907 22.0443 9.0714 21.7226 9.33239L21.3583 9.628C20.2733 10.5085 18.6565 10.1973 17.9757 8.97701L17.2982 7.76255L15.2804 9.78033C14.9875 10.0732 14.5126 10.0732 14.2197 9.78033C13.9268 9.48743 13.9268 9.01256 14.2197 8.71967L16.5385 6.40087L15.6622 4.83Z"/>
    <path d="M8.34835 13.8922C6.89604 14.1756 5.25531 14.2384 3.67207 14.2484C3.32888 15.4975 3.43407 16.407 3.73871 17.0356C4.07937 17.7386 4.73159 18.2194 5.611 18.4387C7.40941 18.8874 9.9779 18.1758 11.6859 16.227C11.9589 15.9155 12.4328 15.8843 12.7443 16.1573C13.0558 16.4304 13.087 16.9042 12.814 17.2157C10.772 19.5456 7.64317 20.4917 5.24793 19.8941C4.03052 19.5904 2.96183 18.8721 2.38886 17.6898C1.81935 16.5145 1.80262 15.0113 2.41127 13.2545C3.23467 10.8778 4.48257 9.40236 5.72896 8.48846C6.96797 7.57996 8.16564 7.25537 8.84942 7.11529C10.4045 6.79672 11.7563 7.24025 12.5001 8.21665C13.2539 9.20604 13.2405 10.5633 12.4051 11.7043C11.4811 12.9663 9.95734 13.5781 8.34835 13.8922ZM9.15047 8.58477C8.58425 8.70077 7.61692 8.96415 6.61593 9.69812C5.79267 10.3018 4.91895 11.2439 4.23027 12.7421C5.5922 12.7203 6.90768 12.6451 8.061 12.42C9.5385 12.1316 10.6048 11.624 11.1948 10.8182C11.6835 10.1507 11.6129 9.52728 11.3069 9.12564C10.9911 8.71102 10.2809 8.35319 9.15047 8.58477Z"/>
    </svg>`;
  }


  static get sanitize() {
    return {
      script: {
        type: 'math/tex',
      }
    };
  }
}