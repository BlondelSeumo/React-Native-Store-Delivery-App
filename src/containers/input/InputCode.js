import React, {useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {ThemeConsumer} from 'src/components';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {padding, margin, borderRadius} from 'src/components/config/spacing';
import fonts, {sizes} from 'src/components/config/fonts';

const styles = {
  root: {flex: 1, padding: padding.large + 4},
  title: {textAlign: 'center', fontSize: sizes.h1, ...fonts.medium},
  codeFiledRoot: {marginTop: margin.large + 4, marginBottom: 50},
  cell: theme => ({
    width: 40,
    height: 40,
    lineHeight: 36,
    fontSize: sizes.h2,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: borderRadius.small,
    textAlign: 'center',
  }),
  focusCell: theme => ({
    borderColor: theme.colors.textColor,
  }),
};

const CELL_COUNT = 6;

const App = ({onFulfill}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <ThemeConsumer>
      {({theme}) => (
        <SafeAreaView style={styles.root}>
          <CodeField
            onBlur={() => onFulfill(value)}
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            autoFocus={true}
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[
                  styles.cell(theme),
                  isFocused && styles.focusCell(theme),
                ]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </SafeAreaView>
      )}
    </ThemeConsumer>
  );
};

export default App;
