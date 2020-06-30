import React from 'react';
import {withTranslation} from 'react-i18next';
import isEqual from 'lodash/isEqual';
import {StyleSheet, Modal, ScrollView} from 'react-native';
import {ThemedView, Text, Header, ListItem} from 'src/components';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import RadioIcon from '../containers/RadioIcon';
import Container from 'src/containers/Container';
import Button from 'src/containers/Button';

import {margin} from 'src/components/config/spacing';

class ModalFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: props.select,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.visible &&
      prevProps.visible !== this.props.visible &&
      this.props.select !== this.state.selectValue
    ) {
      this.updateSelectValue(this.props.select);
    }
  }
  updateSelectValue = value => {
    this.setState({
      selectValue: value,
    });
  };

  goResult = () => {
    this.props.setModalVisible(false);
    this.props.handleSort(this.state.selectValue);
  };

  render() {
    const {visible, setModalVisible, t} = this.props;
    const {selectValue} = this.state;
    const sortBy = [
      {
        key: 'popularity',
        title: t('catalog:text_sort_popular'),
        query: {orderby: 'popularity'},
      },
      {
        key: 'rating',
        title: t('catalog:text_sort_rating'),
        query: {orderby: 'rating'},
      },
      {
        key: 'date',
        title: t('catalog:text_latest'),
        query: {},
      },
      {
        key: 'price',
        title: t('catalog:text_sort_price_low'),
        query: {order: 'asc', orderby: 'price'},
      },
      {
        key: 'price-desc',
        title: t('catalog:text_sort_price_high'),
        query: {order: 'desc', orderby: 'price'},
      },
    ];

    return (
      <Modal
        visible={visible}
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <ThemedView isFullView>
          <Header
            containerStyle={styles.header}
            leftComponent={
              <IconHeader
                name="x"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            }
            centerComponent={<TextHeader title={t('common:text_refine')} />}
            rightComponent={
              <TextHeader
                title={t('common:text_clear_all')}
                type="button"
                onPress={() => this.updateSelectValue({})}
              />
            }
          />
          <ScrollView>
            <Container>
              <Text h3 medium style={styles.textSort}>
                {t('catalog:text_sort')}
              </Text>
              {sortBy.map(item => (
                <ListItem
                  key={item.key}
                  title={item.title}
                  type="underline"
                  small
                  rightIcon={
                    <RadioIcon isSelect={isEqual(item, selectValue)} />
                  }
                  containerStyle={styles.item}
                  onPress={() => this.updateSelectValue(item)}
                />
              ))}
            </Container>
          </ScrollView>
          <Container style={styles.footer}>
            <Button title={t('catalog:text_result')} onPress={this.goResult} />
          </Container>
        </ThemedView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
  },
  textSort: {
    marginTop: margin.large,
  },
  textFilter: {
    marginTop: margin.big + margin.small,
  },
  footer: {
    marginVertical: margin.big,
  },
});

export default withTranslation()(ModalFilter);
