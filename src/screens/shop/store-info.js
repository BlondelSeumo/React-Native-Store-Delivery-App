import React from 'react';
import {ScrollView} from 'react-native';
import {withTranslation} from 'react-i18next';
import {ThemedView, Header} from 'src/components';
import {IconHeader} from 'src/containers/HeaderComponent';
import MapStore from './store-info/MapStore';
import InfoVendor from './store-info/InfoVendor';
import TimeStore from './store-info/TimeStore';
import SocialStore from './store-info/SocialStore';
import Empty from 'src/containers/Empty';
import {homeTabs} from 'src/config/navigator';

class StoreInfo extends React.Component {
  constructor(props) {
    super(props);
    const {route} = this.props;
    const vendor = route?.params?.vendor ?? null;
    this.state = {
      vendor,
    };
  }
  render() {
    const {navigation, t} = this.props;
    const {vendor} = this.state;
    if (!vendor) {
      return (
        <ThemedView isFullView>
          <Empty
            icon="box"
            title={t('empty:text_title_product')}
            subTitle={t('empty:text_subtitle_product')}
            titleButton={t('common:text_go_shopping')}
            clickButton={() => navigation.navigate(homeTabs.shop)}
          />
        </ThemedView>
      );
    }

    return (
      <ThemedView isFullView>
        <Header leftComponent={<IconHeader name="x" size={24} />} />
        <ScrollView>
          <MapStore vendor={vendor} />
          <InfoVendor vendor={vendor} />
          <TimeStore storeHours={vendor.wcfm_store_hours} />
          <SocialStore socials={vendor.social} />
        </ScrollView>
      </ThemedView>
    );
  }
}

export default withTranslation()(StoreInfo);
