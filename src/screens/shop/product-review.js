import React from 'react';

import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, ScrollView, ActivityIndicator} from 'react-native';
import {Header, ThemedView} from 'src/components';
import Button from 'src/containers/Button';
import Container from 'src/containers/Container';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import InfoRating from './containers/InfoRating';
import CommentItem from './containers/CommentItem';

import {fetchReview} from 'src/modules/product/actions';
import {dataReviewSelector} from 'src/modules/product/selectors';

import {mainStack} from 'src/config/navigator';
import {margin, padding} from 'src/components/config/spacing';
import {getSiteConfig} from 'src/modules/common/selectors';

class ReviewScreen extends React.Component {
  componentDidMount() {
    const {route, dispatch} = this.props;
    const product_id = route?.params?.product_id ?? '';
    if (product_id) {
      dispatch(fetchReview(product_id));
    }
  }

  render() {
    const {route, t, dataReview, siteConfig, navigation} = this.props;
    const data = dataReview.get('data');
    const product_id = route?.params?.product_id ?? '';
    const image = route?.params?.image ?? '';
    const name = route?.params?.name ?? '';

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader name="x" size={24} />}
          centerComponent={
            <TextHeader title={t('common:text_product_review')} />
          }
        />
        <ScrollView style={styles.content}>
          <InfoRating />
          {dataReview.get('loading') ? (
            <View>
              <ActivityIndicator />
            </View>
          ) : (
            data
              .toJS()
              .map(review => (
                <CommentItem
                  key={review.id}
                  data={review}
                  tz={siteConfig.get('timezone_string')}
                />
              ))
          )}
        </ScrollView>
        <Container style={styles.footer}>
          <Button
            title={t('catalog:text_write_review')}
            onPress={() =>
              navigation.navigate(mainStack.product_review_form, {
                image: image,
                name: name,
                product_id: product_id,
              })
            }
            size={'small'}
            buttonStyle={styles.button}
          />
        </Container>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  footer: {
    marginVertical: margin.big,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: padding.big - 4,
  },
});

const mapStateToProps = state => {
  return {
    dataReview: dataReviewSelector(state),
    siteConfig: getSiteConfig(state),
  };
};
export default connect(mapStateToProps)(withTranslation()(ReviewScreen));
