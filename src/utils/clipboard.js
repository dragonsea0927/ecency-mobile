import { Clipboard } from 'react-native';

const readFromClipboard = async () => {
  const clipboardContent = await Clipboard.getString();
  return clipboardContent;
};

const writeToClipboard = async (text) => {
  await Clipboard.setString(text);
  console.log(text);
};

export { writeToClipboard, readFromClipboard };
