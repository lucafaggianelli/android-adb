'use babel';

import AndroidAdbView from './android-adb-view';
import { CompositeDisposable } from 'atom';

const LOGCAT_COLORS = [
    '0;37',
    '0;37',
    '0;37',
    '0;37', // Debug
    '0;34', // Info
    '0;33', // Warn
    '0;31', // Error
    '0;35', // Fatal
    '0;37',
];

export default {

  androidAdbView: null,
  subscriptions: null,

  activate(state) {
    this.androidAdbView = new AndroidAdbView();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'android-adb:logcat': () => this.logcat()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.androidAdbView.destroy();
  },

  serialize() {
    return {
      androidAdbViewState: this.androidAdbView.serialize()
    };
  },

  logcat() {
    //this.androidAdbView.panel.show();
    var logcat = require('adbkit-logcat');
    var spawn = require('child_process').spawn;

    // Retrieve a binary log stream
    this.child = spawn('adb', ['logcat', '-B']);

    //this.child.stdout.setEncoding('utf8');
    //this.child.stderr.setEncoding('utf8');
    this.child.stderr.on('data', (d) => {
      console.log('error', d);
    });

    //this.child.stderr.pipe(this.androidAdbView.terminal);

    terminal = this.androidAdbView.terminal;
    reader = logcat.readStream(this.child.stdout);
    reader.on('entry', (entry) => {
      var line = '';
      line += '\x1b['+ LOGCAT_COLORS[entry.priority] +'m';
      line += logcat.Priority.toLetter(entry.priority) + ' ';
      line += entry.tag;
      line += '\x1b[m: ';
      line += entry.message;
      line += '\r\n';

      terminal.write(line);
    });

    this.androidAdbView.toggle();

    process.on('exit', function() {
      proc.kill();
    });
  }

};
