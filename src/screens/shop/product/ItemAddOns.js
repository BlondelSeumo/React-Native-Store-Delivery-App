import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, ListItem} from 'src/components';
import ViewUnderline from 'src/containers/ViewUnderline';
import IconRadius from 'src/containers/IconRadius';
import {red} from 'src/components/config/colors';
import {padding, margin} from 'src/components/config/spacing';
import currencyFormatter from 'src/utils/currency-formatter';

class ItemAddOns extends React.Component {
  render() {
    const {
      data,
      style,
      itemStyle,
      handleSelect,
      addonsSelected,
      currency,
      secondary,
    } = this.props;
    if (!data) {
      return null;
    }
    return (
      <ViewUnderline
        style={StyleSheet.flatten([styles.container, style && style])}
        secondary={secondary}>
        <View style={styles.viewName}>
          <Text h3 bold>
            {data.name}
            {data.required ? (
              <Text h3 bold h3Style={styles.textNote}>
                *
              </Text>
            ) : null}
          </Text>
          <Text colorThird h6 h6Style={styles.texOptional}>
            {data.description}
          </Text>
        </View>
        {data.options.map((option, index) => {
          const isSelected =
            addonsSelected.findIndex(
              a => a.field_name === data.field_name && a.value === option.label,
            ) > -1;

          return (
            <ListItem
              title={option.label}
              key={index}
              type="underline"
              rightElement={
                option.price ? (
                  <Text colorSecondary={!isSelected} bold={isSelected}>
                    {currencyFormatter(option.price, currency)}
                  </Text>
                ) : null
              }
              leftElement={
                <IconRadius type={data.display} isSelect={isSelected} />
              }
              titleProps={{
                colorSecondary: !isSelected,
                bold: isSelected,
              }}
              containerStyle={[
                data.options.length - 1 === index && styles.itemLast,
                itemStyle && itemStyle,
              ]}
              onPress={() =>
                handleSelect(
                  {
                    name: data.name,
                    value: option.label,
                    price: option.price,
                    field_name: data.field_name,
                    field_type: data.type,
                    price_type: option.price_type,
                  },
                  data.display,
                )
              }
            />
          );
        })}
      </ViewUnderline>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: padding.large + 4,
    paddingBottom: 0,
  },
  viewName: {
    flexDirection: 'row',
  },
  textNote: {
    color: red,
  },
  texOptional: {
    marginLeft: margin.small,
    marginTop: 11,
    flex: 1,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
});

ItemAddOns.defaultProps = {
  currency: 'en',
  secondary: false,
};
export default ItemAddOns;
