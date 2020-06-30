import React from 'react';
import unescape from 'lodash/unescape';
import {StyleSheet, ScrollView, View} from 'react-native';
import Button from 'src/containers/Button';
import {margin, padding} from 'src/components/config/spacing';

const CategoryList = ({onPress, data}) => {
  if (!data || data.length < 1) {
    return null;
  }
  return (
    <View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {data.map((value, index) => (
          <Button
            key={index}
            onPress={() => onPress(value.id, value.name)}
            title={unescape(value.name)}
            size="small"
            titleProps={{
              medium: true,
            }}
            secondary
            containerStyle={[
              styles.item,
              index === data.length - 1 && styles.itemLast,
            ]}
            buttonStyle={styles.button}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginRight: margin.small,
  },
  itemLast: {
    marginRight: 0,
  },
  button: {
    paddingHorizontal: padding.big - 3,
  },
});

CategoryList.defaultProps = {
  onPress: () => {},
  data: [],
};

export default CategoryList;
