import React, { Component } from 'react';
// External Component
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';

// Styles
import styles from './boostItemsListStyles';

/*
 *            Props Name           Description                                     Value
 *@props -->  selectedSlide        selected slide index for casousel               Number
 *@props -->  handleOnPlaceSelect  when place selected its trigger                 Function
 *@props -->  selectedPlace        selected place index for casousel               Number
 *
 */
const DEVICE_WIDTH = Dimensions.get('window').width;

class BoostItemsListView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycles

  componentWillReceiveProps(nextProps) {
    const { selectedSlide } = this.props;

    if (selectedSlide !== nextProps.selectedSlide) {
      this._goToSelectedSlide(nextProps.selectedSlide);
    }
  }

  // Component Functions

  // [{ name: 'asdas', icon: 'pencil', totalUser: 'asd' }];

  _renderPlaceListItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.slide, { backgroundColor: item.color }]}
      onPress={() => this._handleOnSlidePress(item)}
    >
      <View style={styles.slideContainer}>
        <Text style={styles.pointText}>{item.name}</Text>
        {/* <View
          style={[
            styles.iconWrapper,
            this.props.items[this._carousel.currentIndex] === item && styles.activeIconWrapper,
          ]}
        >
          <Image source={{ uri: item.icon }} style={styles.placeIcon} />
        </View> */}
        <View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  _goToSelectedSlide = index => {
    const { onSnapToItem } = this.props;
    /* eslint-disable-next-line */
    this._carousel.snapToItem(index, (animated = true), (fireCallback = true));
    onSnapToItem(index);
  };

  _handleOnSlidePress = item => {
    const { items, navigateToRoom } = this.props;
    const activeSlideIndex = this._carousel.currentIndex;
    const isSelectedSlideCentered = items[activeSlideIndex] === item;

    if (isSelectedSlideCentered) {
      if (navigateToRoom) navigateToRoom(item);
    } else {
      const nextSlideIndex = items.findIndex(place => place === item);
      const lastSlideIndex = items.length - 1;

      if (
        (activeSlideIndex === lastSlideIndex && nextSlideIndex === 0) ||
        (activeSlideIndex === 0 && nextSlideIndex === lastSlideIndex)
      ) {
        if (activeSlideIndex > nextSlideIndex) {
          this._carousel.snapToNext();
        } else {
          this._carousel.snapToPrev();
        }
      } else if (activeSlideIndex > nextSlideIndex) {
        this._carousel.snapToPrev();
      } else {
        this._carousel.snapToNext();
      }
    }
  };

  render() {
    const { items, onSnapToItem } = this.props;

    return (
      <View>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          snapOnAndroid
          firstItem={0}
          showsHorizontalScrollIndicator={false}
          data={items}
          renderItem={this._renderPlaceListItem}
          sliderWidth={DEVICE_WIDTH}
          itemWidth={DEVICE_WIDTH / 2}
          onSnapToItem={index => onSnapToItem(index)}
          slideStyle={styles.slide}
          containerCustomStyle={styles.slider}
          inactiveSlideOpacity={1}
          activeOpacity={1}
          loop
        />
      </View>
    );
  }
}

export default BoostItemsListView;
