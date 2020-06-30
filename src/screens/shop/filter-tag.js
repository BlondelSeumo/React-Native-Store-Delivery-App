import React from 'react';
import {Text, ThemedView} from 'src/components';

class FilterTag extends React.Component {
  render() {
    return (
      <ThemedView isFullView style={styles.container}>
        <Text>Filter</Text>
      </ThemedView>
    );
  }
}

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default FilterTag;
