class InputSystem {
  element

  constructor(target: HTMLInputElement|HTMLTextAreaElement) {
    if (target.type.startsWith('text')) {
      this.element = target
    } else {
      throw new TypeError(`element "${element.type}"`)
    }
  }
}

export default InputSystem
