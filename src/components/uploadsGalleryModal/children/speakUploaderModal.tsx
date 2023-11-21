import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Video as VideoType } from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import styles from '../styles/speakUploaderModal.styles';
import { MainButton } from '../../mainButton';
import { uploadFile, uploadVideoInfo } from '../../../providers/speak/speak';
import { useAppSelector } from '../../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import QUERIES from '../../../providers/queries/queryKeys';


interface Props {
  setIsUploading:(flag:boolean)=>void;
  isUploading:boolean
}

export const SpeakUploaderModal = forwardRef(({
  setIsUploading,
  isUploading
} : Props, ref) => {
  const sheetModalRef = useRef();

  const queryClient = useQueryClient();

  const currentAccount = useAppSelector((state) => state.account.currentAccount);
  const pinHash = useAppSelector((state) => state.application.pin);

  const [selectedThumb, setSelectedThumb] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);


  const [selectedVido, setSelectedVideo] = useState<VideoType | null>(null);

  useImperativeHandle(ref, () => ({
    showUploader:async (_video: VideoType) => {
      if (sheetModalRef.current) {

        if(_video){
          const _thumb = await createThumbnail({url: _video.sourceURL})
          setSelectedVideo(_video);
          setSelectedThumb(_thumb);
        }
        
        sheetModalRef.current.setModalVisible(true);
      }
    },
  }));

  const _startUpload = async () => {
    if (!selectedVido || isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const { filename, size, duration } = selectedVido;

      const _onProgress = (progress) => {
        console.log('Upload progress', progress);
        setUploadProgress(progress);
      };

      const videoId = await uploadFile(selectedVido, _onProgress);

      let thumbId: any = '';
      if (selectedThumb) {
        thumbId = await uploadFile(selectedThumb, _onProgress);
      }

      console.log('updating video information', videoId, thumbId);

      const response = await uploadVideoInfo(
        currentAccount,
        pinHash,
        filename,
        size,
        videoId,
        thumbId,
        duration,
      );

      queryClient.invalidateQueries([QUERIES.MEDIA.GET_VIDEOS]);

      if(sheetModalRef.current){
        sheetModalRef.current.setModalVisible(false);
      }

      console.log('response after updating video information', response);
    } catch (err) {
      console.warn('Video upload failed', err);
    }

    setIsUploading(false);
  };

  const _onClose = () => {};

  const _renderProgressContent = () => {};

  const _renderFormContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Video
          source={{
            uri: selectedVido?.sourceURL,
          }}
          repeat={true}
          onLoad={() => {}}
          onError={() => {}}
          resizeMode="container"
          fullscreen={false}
          style={styles.mediaPlayer}
          volume={0}
        />

        {/* <View style={styles.titleBox}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Add title to video (optional)"
            placeholderTextColor={EStyleSheet.value('$borderColor')}
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
        </View> */}

        <View style={styles.imageContainer}>
          <Text style={styles.label}>Select Thumbnail</Text>
          <TouchableOpacity onPress={() => handleImageUpload(2)}>
            <Image source={selectedThumb && { uri: selectedThumb.path }} style={styles.thumbnail} />
          </TouchableOpacity>
        </View>

        <MainButton
          style={styles.uploadButton}
          onPress={_startUpload}
          text="START UPLOAD"
          isLoading={isUploading}
        />
      </View>
    );
  };

  return (
    <ActionSheet
      ref={sheetModalRef}
      gestureEnabled={true}
      hideUnderlay
      containerStyle={styles.sheetContent}
      indicatorColor={EStyleSheet.value('$iconColor')}
      onClose={_onClose}
    >
      {_renderFormContent()}
    </ActionSheet>
  );
});
