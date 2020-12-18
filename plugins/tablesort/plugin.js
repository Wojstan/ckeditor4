CKEDITOR.plugins.add('tablesort', {
  icons: 'tablesort',
  init: function (editor) {
    editor.addCommand('executeSorting', new CKEDITOR.dialogCommand('tablesortDialog'));

    editor.ui.addButton('tablesort', {
      label: 'Sort table',
      command: 'executeSorting',
      toolbar: 'others,100'
    });

    CKEDITOR.dialog.add('tablesortDialog', this.path + 'dialogs/tablesort.js');
  }
});


