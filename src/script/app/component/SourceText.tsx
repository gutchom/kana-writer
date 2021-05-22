import React from 'react'

export interface SourceTextFormProps {
}

export interface SourceTextFormState {
}

export default class SourceTextForm extends React.Component<SourceTextFormProps, SourceTextFormState> {
  state = {}

  render() {
    return (
      <form name="source" id="writing">
        <textarea name="text" cols="48" rows="32" />
        <br />
        <button name="convert">
          <span lang="en">Start</span>
          <span lang="ja">開始</span>
        </button>
        <button name="resume" hidden>
          <span lang="en">Resume</span>
          <span lang="ja">再開</span>
        </button>
      </form>
    )
  }
}
