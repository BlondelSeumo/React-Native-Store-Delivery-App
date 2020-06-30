import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Text} from 'src/components';
import {yellow, orange} from 'src/components/config/colors';

const RatingItem = ({rating, style}) => {
  const numberRating = parseFloat(rating) > 0 ? parseFloat(rating) : 0;
  return (
    <View style={[styles.container, style && style]}>
      <Icon
        size={16}
        name={'star'}
        color={yellow}
        type={'material'}
        containerStyle={styles.icon}
      />
      <Text medium style={styles.rating}>
        {numberRating.toFixed(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 2,
  },
  rating: {
    color: orange,
  },
});

export default RatingItem;
