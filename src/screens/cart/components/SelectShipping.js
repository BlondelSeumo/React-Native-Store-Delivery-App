import React from 'react';

import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Icon, Modal, Button} from 'src/components';
import Container from 'src/containers/Container';
import {ItemShippingMethod} from './ItemShippingMethod';

import {orange} from 'src/components/config/colors';
import {margin} from 'src/components/config/spacing';

class SelectShipping extends React.Component {
  constructor(props) {
    super(props);
    const {data} = props;
    const selected = data.chosen_method || data.index;
    this.state = {
      isSelected: selected,
    };
  }
  setModalVisible = value => {
    const {data} = this.props;
    if (value === false) {
      const selected = data.chosen_method || data.index;
      if (selected !== this.state.isSelect) {
        this.setState({
          isSelected: selected,
        });
      }
    }
    this.props.setModalVisible();
  };
  onSave = () => {
    const {onChange, setModalVisible} = this.props;
    const {isSelected} = this.state;
    onChange(isSelected);
    setModalVisible();
  };
  render() {
    const {data, visible, t} = this.props;
    const {isSelected} = this.state;
    return (
      <Modal
        visible={visible}
        setModalVisible={this.setModalVisible}
        topCenterElement={
          <Text h3 medium h3Style={styles.textHeader}>
            {t('cart:text_choose_shipping')}
          </Text>
        }
        topRightElement={
          <Button
            title={t('common:text_save')}
            size="small"
            onPress={this.onSave}
          />
        }
        ratioHeight={0.6}>
        <ScrollView>
          <Container>
            <View style={styles.content}>
              <Icon
                size={26}
                name={'truck-fast'}
                type="material-community"
                color={orange}
              />
              <Text medium h3 h3Style={styles.textName}>
                {data.store?.store_name}
              </Text>
            </View>
            <Text h5 colorFourth h5Style={styles.textDescription}>
              {t('cart:text_choose_shipping_description')}
            </Text>
            {data.available_methods.length > 0 ? (
              <View>
                {data.available_methods.map(item => (
                  <ItemShippingMethod
                    key={item.id}
                    onSelect={() => this.setState({isSelected: item.id})}
                    selected={item.id === isSelected}
                    item={item}
                  />
                ))}
              </View>
            ) : null}
          </Container>
        </ScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  textHeader: {
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    marginBottom: margin.small,
  },
  textName: {
    flex: 1,
    marginLeft: margin.large - 2,
  },
  textDescription: {
    marginBottom: margin.base,
  },
});

export default SelectShipping;
