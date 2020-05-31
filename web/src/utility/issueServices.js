import { displaySimpleNotification } from './services';

export const normFile = (e) => {
  if (e.fileList.length >= 6) {
    while (e.fileList.length >= 6) e.fileList.pop();
    displaySimpleNotification('Error', 6, 'bottomRight', 'Image uploads are limited to five.', 'warning', 'red');
  }
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const disabledDate = (current) => {
  return current && current.valueOf() < Date.now() - 60 * 60 * 24 * 1000 * 2;
};
