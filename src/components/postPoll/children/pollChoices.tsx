import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bar as ProgressBar } from 'react-native-progress';
import styles from '../styles/pollChoices.styles';
import getWindowDimensions from '../../../utils/getWindowDimensions';
import EStyleSheet from 'react-native-extended-stylesheet';
import { PollChoice, PollVoter } from '../../../providers/polls/polls.types';
import { mapMetaChoicesToPollChoices } from '../../../providers/polls/converters';
import { CheckBox } from '../../checkbox';
import { PostMetadata } from '../../../providers/hive/hive.types';
import { PollModes } from '../container/postPoll';

interface PollChoicesProps {
  loading: boolean;
  metadata: PostMetadata;
  choices?: PollChoice[];
  userVote?: PollVoter;
  mode: PollModes;
  selection: number;
  handleChoiceSelect: (optionNum: number) => void;
}



export const PollChoices = ({ 
  choices, 
  metadata, 
  userVote, 
  mode, 
  loading, 
  selection,
  handleChoiceSelect }: PollChoicesProps) => {

  const [_choices, setChoices] = useState(
    choices || mapMetaChoicesToPollChoices(metadata.choices));

  const totalVotes = useMemo(
    () => _choices.reduce(
      (prevVal, option) => prevVal + (option?.votes?.total_votes) || 0, 0)
    , [_choices]);


  const _voteDisabled = useMemo(() => metadata.vote_change !== undefined
    ? !metadata.vote_change && !!userVote
    : false, [metadata, userVote]);

  useEffect(() => {
    if (!loading && !!choices) {
      setChoices(choices)
    }
  }, [loading, choices])


  const _isModeSelect = mode === PollModes.SELECT


  const _handleChoiceSelect = (choiceNum:number) => {
      handleChoiceSelect(choiceNum === selection ? 0 : choiceNum);
  }


  const _renderProgressBar = (option: PollChoice) => {
    const _isVoted = !_isModeSelect && (userVote?.choice_num === option.choice_num)
    const _isSelected = selection === option.choice_num

    const votes = option.votes?.total_votes || 0;
    const percentage = (!_isModeSelect && !!totalVotes) ? (votes / totalVotes) * 100 : 0; //TODO: adjust logic here
    const _barWidth = getWindowDimensions().width - 64;

    const _barStyle = {
        ...styles.progressBar, 
        borderColor: EStyleSheet.value(_isSelected ? '$primaryBlue' : 'transparent')}

    return (
      <View style={styles.choiceWrapper}>
        <View>
          <ProgressBar
            progress={_isModeSelect ? 0 : percentage / 100} width={_barWidth} height={40}
            style={_barStyle}
            unfilledColor={EStyleSheet.value("$primaryLightBackground")}
            color={EStyleSheet.value("$iconColor")}
            indeterminate={mode === PollModes.LOADING}
            useNativeDriver={true}
          />
          <View style={styles.progressContentWrapper}>
            <View style={styles.choiceLabelWrapper}>
              <CheckBox locked isChecked={_isVoted} />
              <Text style={styles.label}>{option.choice_text}</Text>
            </View>
            {!_isModeSelect &&
              <Text style={styles.count}>{`${votes} voted`}</Text>
            }

          </View>
        </View>
      </View>
    );
  };


  const renderOptions = () => {
    return _choices.map((option, index) => {

      return (
        <TouchableOpacity key={index} onPress={() => _handleChoiceSelect(option.choice_num)}>
          <View style={{ marginVertical: 5 }}>
            {_renderProgressBar(option)}
          </View>
        </TouchableOpacity>
      );
    });
  };



  return (
    <View>
      {renderOptions()}
    </View>
  );
};
