import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Avatar, Icon, withTheme} from 'src/components';
import {orange} from 'src/components/config/colors';
import {margin, padding, borderRadius} from 'src/components/config/spacing';

const Item2 = ({item, style, clickPage, typeUrl, theme}) => {
  const {rating} = item;
  const {rating: aveRating} = rating;
  const numRating = parseFloat(aveRating) ? parseFloat(aveRating) : 0;
  const valueRating = numRating.toFixed(1);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: theme.colors.bgColorSecondary},
        style && style,
      ]}
      onPress={clickPage}>
      <Avatar
        source={
          item[typeUrl]
            ? {uri: item[typeUrl]}
            : require('src/assets/images/pDefault.png')
        }
        size={60}
        rounded
        containerStyle={styles.image}
      />

      <Text h5 medium style={styles.name} numberOfLines={2}>
        {item.store_name}
      </Text>
      <View style={styles.viewRating}>
        <Text h5 medium h5Style={styles.textRating}>
          {valueRating}
        </Text>
        <Icon
          name="star"
          type="font-awesome"
          color={theme.colors.warning}
          size={13}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.large,
    width: 135,
    padding: padding.large,
    alignItems: 'center',
  },
  image: {
    marginBottom: margin.small + 1,
  },
  name: {
    marginBottom: 2,
    textAlign: 'center',
  },
  viewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRating: {
    marginRight: 5,
    color: orange,
  },
});

Item2.defaultProps = {
  typeUrl: 'gravatar',
};

export default withTheme(Item2);
