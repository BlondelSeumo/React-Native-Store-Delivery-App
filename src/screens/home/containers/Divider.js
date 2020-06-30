import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';
class Divider extends React.Component {
  render() {
    const {fields} = this.props;
    if (!fields) {
      return null;
    }
    const height =
      fields.height && parseInt(fields.height, 0)
        ? parseInt(fields.height, 0)
        : 1;

    return (
      <ThemeConsumer>
        {({theme}) => (
          <Container disable={fields?.boxed ? 'all' : 'null'}>
            <View style={[styles.viewLine, {height: height}]}>
              <View
                style={[
                  {
                    borderWidth: height,
                    borderColor: fields?.color ?? theme.colors.primary,
                    borderStyle: fields?.style,
                  },
                  fields?.style === 'solid' && styles.viewType,
                ]}
              />
            </View>
          </Container>
        )}
      </ThemeConsumer>
    );
  }
}
const styles = StyleSheet.create({
  viewLine: {
    overflow: 'hidden',
  },
  viewType: {
    borderRadius: 1,
  },
});

export default Divider;
