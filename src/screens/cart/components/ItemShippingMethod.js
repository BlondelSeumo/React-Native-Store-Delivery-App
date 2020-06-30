import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {ThemeConsumer} from 'src/components';
import TextHtml from 'src/containers/TextHtml';
import IconRadius from 'src/containers/IconRadius';
import {margin, padding} from 'src/components/config/spacing';
import fonts from 'src/components/config/fonts';

export const ItemShippingMethod = React.memo(({item, selected, onSelect}) => {
  return (
    <ThemeConsumer>
      {({theme}) => {
        const styleTextHtml = {
          color: theme.colors.textColorSecondary,
        };
        const styleTextHtmlSelect = {
          color: theme.colors.textColor,
          ...fonts.medium,
        };

        return (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onSelect}
            style={[
              styles.container,
              {borderBottomColor: theme.colors.borderSecondary},
            ]}>
            <IconRadius type="radius" isSelect={selected} />
            <View style={styles.content}>
              <TextHtml
                withThemeConfig={false}
                style={htmlViewStyles(
                  selected ? styleTextHtmlSelect : styleTextHtml,
                )}
                value={item.label}
              />
            </View>
          </TouchableOpacity>
        );
      }}
    </ThemeConsumer>
  );
});

const htmlViewStyles = style => ({
  div: style,
  span: style,
});

const styles = StyleSheet.create({
  container: {
    minHeight: 59,
    paddingVertical: padding.base,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    marginLeft: margin.small + 1,
  },
});
