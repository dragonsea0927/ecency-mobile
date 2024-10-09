import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

// Services and Actions
import ActionSheet from 'react-native-actions-sheet';
import { View } from 'react-native';
import Comments from '../../comments';
import styles from '../styles/commentsModal.styles';

export const CommentsModal = forwardRef((_, ref) => {
  const bottomSheetModalRef = useRef<ActionSheet | null>(null);

  const [comments, setComments] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    show: (_comments) => {
      if (bottomSheetModalRef.current) {
        setComments(_comments);
        bottomSheetModalRef.current.show();
      }
    },
  }));

  const _renderContent = (
    <View style={{ height: '100%', width: '100%' }}>
      <Comments
        comments={comments}
        fetchPost={() => {
          console.log('implement fetch if required');
        }}
      />
    </View>
  );

  return (
    <ActionSheet
      ref={bottomSheetModalRef}
      gestureEnabled={true}
      hideUnderlay={true}
      containerStyle={styles.sheetContent}
      indicatorStyle={styles.indicator}
    >
      {_renderContent}
    </ActionSheet>
  );
});
