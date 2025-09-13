const { ipcMain, dialog } = require('electron');
const path = require('path');

ipcMain.handle('open-file', async () => {
  try {
    console.log('Opening file dialog...');
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Videos', extensions: ['mp4', 'webm', 'ogg', 'mov', 'avi'] }
      ]
    });
    if (canceled || !filePaths || filePaths.length === 0) {
      console.log('File dialog canceled or no file selected');
      return null;
    }
    const filePath = filePaths[0];
    const normalizedPath = path.normalize(filePath);
    const fileUrl = `file://${normalizedPath}`;
    console.log('Selected file URL:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('Error in open-file handler:', error);
    throw error;
  }
});