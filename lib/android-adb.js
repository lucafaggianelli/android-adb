'use babel';

import AndroidAdbView from './android-adb-view';
import { CompositeDisposable } from 'atom';

export default {

  androidAdbView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.androidAdbView = new AndroidAdbView(state.androidAdbViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.androidAdbView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'android-adb:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.androidAdbView.destroy();
  },

  serialize() {
    return {
      androidAdbViewState: this.androidAdbView.serialize()
    };
  },

  toggle() {
    console.log('AndroidAdb was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
