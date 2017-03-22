Package.describe({
  name: 'geskep:hotkeys',
  summary: 'Easy and effective hotkeys for your app, powered by Mousetrap and forked from nerdmed/hotkeys',
  version: '1.0.0',
  git: 'https://github.com/samuelluis/hotkeys.git'
});

Package.onUse(function(api, where) {
  api.versionsFrom('1.0');
  api.use(['underscore', 'jquery', 'check', 'geskep:mousetrap'], 'client');
  api.addFiles(['hotkeys.js'], 'client');

  api.export('Hotkeys');
});
