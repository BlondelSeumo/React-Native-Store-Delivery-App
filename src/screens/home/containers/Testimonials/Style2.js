import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Image, withTheme} from 'src/components';
import Rating from 'src/containers/Rating';

import {sizes} from 'src/components/config/fonts';
import {margin} from 'src/components/config/spacing';

const TestimonialItem2 = ({item, language, style}) => {
  if (!item) {
    return null;
  }
  return (
    <View style={[styles.container, style && style]}>
      <Image
        source={
          item?.image?.[language]
            ? {uri: item.image[language]}
            : require('src/assets/images/pDefault.png')
        }
        style={styles.image}
        resizeMode="stretch"
        containerStyle={styles.containerImage}
      />
      {item?.title?.text?.[language] ? (
        <Text medium style={[styles.title, item?.title?.style]}>
          {item.title.text[language]}
        </Text>
      ) : null}
      {item?.description?.text?.[language] ? (
        <Text
          colorSecondary
          style={[styles.description, item?.description?.style]}>
          {item.description.text[language]}
        </Text>
      ) : null}
      <Rating readonly startingValue={item.rating} size={12} />
      {item?.user?.text?.[language] ? (
        <Text medium style={[styles.username, item?.user?.style]}>
          {item.user.text[language]}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: margin.big,
  },
  containerImage: {
    marginBottom: margin.big,
  },
  image: {
    height: 30,
    width: 35,
  },
  right: {
    flex: 1,
    marginLeft: margin.big - 4,
  },
  title: {
    fontSize: sizes.h3,
    marginBottom: margin.large + 4,
  },
  description: {
    marginBottom: margin.large + 4,
  },
  username: {
    marginTop: margin.small,
  },
});

TestimonialItem2.defaultProps = {
  language: 'en',
};

export default withTheme(TestimonialItem2);
