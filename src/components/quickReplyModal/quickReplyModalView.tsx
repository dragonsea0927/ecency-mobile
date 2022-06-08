import React, { useImperativeHandle, useRef, useState } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import EStyleSheet from 'react-native-extended-stylesheet';
import { forwardRef } from 'react';
import { Portal } from 'react-native-portalize';
import { QuickReplyModalContent } from './quickReplyModalContent';
import styles from './quickReplyModalStyles';

export interface QuickReplyModalProps {
  fetchPost?: any;
}

const QuickReplyModal = ({ fetchPost }: QuickReplyModalProps, ref) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const sheetModalRef = useRef<ActionSheet>();
  const inputRef = useRef<TextInput>(null);
  const handleCloseRef = useRef(null);

  //CALLBACK_METHOD
  useImperativeHandle(ref, () => ({
    show: (post: any) => {
      setSelectedPost(post);
      sheetModalRef.current?.setModalVisible(true);
      // wait  for modal to open and then show the keyboard
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    },
  }));

  return (
    <Portal>
      <ActionSheet
        ref={sheetModalRef}
        gestureEnabled={true}
        keyboardShouldPersistTaps="always"
        containerStyle={styles.sheetContent}
        keyboardHandlerEnabled
        indicatorColor={EStyleSheet.value('$primaryWhiteLightBackground')}
        onClose={() => handleCloseRef.current()}
      >
        <QuickReplyModalContent
          fetchPost={fetchPost}
          selectedPost={selectedPost}
          inputRef={inputRef}
          sheetModalRef={sheetModalRef}
          handleCloseRef={handleCloseRef}
        />
      </ActionSheet>
    </Portal>
  );
};

export default forwardRef(QuickReplyModal as any);
