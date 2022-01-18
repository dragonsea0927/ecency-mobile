import React from 'react';
import { View, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// Components
import { DropdownButton, PopoverWrapper, Icon, GrayWrapper } from '../../..';

// Styles
import styles from './walletLineItemStyles';

const WalletLineItem = ({
  description,
  fitContent,
  iconName,
  iconType,
  isBlackText,
  isBoldText,
  isCircleIcon,
  isThin,
  rightText,
  rightTextColor,
  text,
  textColor,
  index,
  style,
  isHasdropdown,
  dropdownOptions,
  onDropdownSelect,
  hintIconName,
  hintDescription,
  onPress,
}) => (
  <TouchableWithoutFeedback onPress={onPress} disabled={!onPress}>
    <GrayWrapper isGray={index && index % 2 !== 0}>
      <View style={[styles.container, fitContent && styles.fitContent, style]}>
        <View style={styles.iconTextWrapper}>
          {iconName && (
            <View
              style={[
                styles.iconWrapper,
                isCircleIcon && styles.circleIcon,
                index && { backgroundColor: `${index && index % 2 !== 0 ? 'white' : '#f5f5f5'}` },
              ]}
            >
              <Icon style={styles.icon} name={iconName} iconType={iconType} />
            </View>
          )}
          <View>
            {!!text && (
              <View style={styles.textWrapper}>
                <Text
                  style={[
                    styles.text,
                    !iconName && styles.onlyText,
                    rightText && styles.longText,
                    isBlackText && styles.blackText,
                    textColor && { color: textColor },
                    isBoldText && { fontWeight: 'bold' },
                    isThin && styles.thinText,
                  ]}
                >
                  {text}
                </Text>
                {!!hintIconName && (
                  <PopoverWrapper text={hintDescription}>
                    <Icon
                      style={[styles.hintIcon, styles.icon]}
                      name={hintIconName}
                      iconType={iconType}
                    />
                  </PopoverWrapper>
                )}
              </View>
            )}
            {!!description && (
              <Text style={[styles.description, !iconName && styles.onlyText]}>{description}</Text>
            )}
          </View>
        </View>
        {!!rightText && (
          <View style={styles.rightTextWrapper}>
            <Text
              style={[
                styles.rightText,
                rightTextColor ? { color: rightTextColor } : !text && styles.onlyRightText,
              ]}
            >
              {rightText}
            </Text>
          </View>
        )}
        {isHasdropdown && (
          <View style={styles.dropdownWrapper}>
            <DropdownButton
              isHasChildIcon
              iconName="arrow-drop-down"
              options={dropdownOptions}
              noHighlight
              onSelect={onDropdownSelect}
              rowTextStyle={styles.dropdownRowText}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
        )}
      </View>
    </GrayWrapper>
  </TouchableWithoutFeedback>
);

export default WalletLineItem;
