import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Row} from 'src/containers/Gird';
import Item from './Item';

const WIDTH_SCREEN = Dimensions.get('window').width;

const pDefault = require('src/assets/images/pDefault.png');

const Gird = ({
  images,
  col,
  widthView,
  widthImage,
  heightImage,
  pad,
  radius,
  clickBanner,
  language,
}) => {
  const paddingImages = pad * (col - 1);
  const width = (widthView - paddingImages) / col;
  const height = (width * heightImage) / widthImage;

  return (
    <Row
      style={[
        styles.row,
        {
          marginLeft: -pad / 2,
          marginRight: -pad / 2,
        },
      ]}>
      {images.map((item, index) => (
        <Item
          key={index}
          language={language}
          source={
            item?.image?.[language] ? {uri: item.image[language]} : pDefault
          }
          title={item?.title}
          radius={radius}
          width={width}
          height={height}
          clickBanner={() => clickBanner(item.action)}
          contentContainerStyle={{marginHorizontal: pad / 2}}
        />
      ))}
    </Row>
  );
};

const styles = StyleSheet.create({
  row: {
    flexWrap: 'wrap',
  },
});
Gird.defaultProps = {
  images: [],
  col: 1,
  widthView: WIDTH_SCREEN,
  widthImage: 323,
  heightImage: 232,
  pad: 0,
  radius: 0,
  language: 'en',
};

export default Gird;
