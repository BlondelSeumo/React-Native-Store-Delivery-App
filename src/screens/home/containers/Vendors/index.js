import React, {Component} from 'react';

import {connect} from 'react-redux';
import {compose} from 'recompose';

import {Dimensions, StyleSheet} from 'react-native';
import {withNavigation} from '@react-navigation/compat';
import {withTranslation} from 'react-i18next';

import Container from 'src/containers/Container';
import Heading from 'src/containers/Heading';
import ListCarousel from './ListCarousel';
import ListGrid from './ListGrid';
import VendorItem from 'src/containers/VendorItem';
import VendorItemLoading from 'src/containers/VendorItem/Loading';

import {mainStack} from 'src/config/navigator';
import {languageSelector} from 'src/modules/common/selectors';
import {locationSelector} from 'src/modules/auth/selectors';
import {getVendors} from 'src/modules/vendor/service';

import {padding} from 'src/components/config/spacing';
import isEqual from 'lodash/isEqual';

const {width: WIDTH_SCREEN} = Dimensions.get('window');
const initHeader = {
  style: {},
};

class Vendors extends Component {
  constructor(props) {
    super(props);
    const {fields} = props;
    this.state = {
      data: [],
      loading: false,
      limit:
        fields && fields.limit && parseInt(fields.limit, 0)
          ? parseInt(fields.limit, 0)
          : 4,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const {fields, location} = this.props;
    this.setState({
      loading: true,
    });
    const limit =
      fields && fields.limit && parseInt(fields.limit, 0) > 0
        ? parseInt(fields.limit, 0)
        : 4;
    const range =
      fields && fields.radius_range && parseFloat(fields.radius_range) > 0
        ? parseFloat(fields.radius_range)
        : 50;

    const query = {
      per_page: limit,
      wcfmmp_radius_range: range,
      wcfmmp_radius_lat: location.latitude,
      wcfmmp_radius_lng: location.longitude,
    };
    getVendors(query)
      .then(data => {
        this.setState({
          loading: false,
          data,
        });
      })
      .catch(e => {
        this.setState({
          loading: false,
        });
        console.log(e);
      });
  }
  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.location, this.props.location)) {
      this.fetchData();
    }
  }

  render() {
    const {
      navigation,
      layout,
      fields,
      widthComponent: widthView,
      language,
      t,
    } = this.props;
    const {data, loading, limit} = this.state;
    if (
      !fields ||
      typeof fields !== 'object' ||
      Object.keys(fields).length < 1
    ) {
      return null;
    }
    const heading = fields.text_heading ? fields.text_heading : initHeader;
    const typeUrl = fields.type_url || 'banner_url';

    let widthImage =
      fields.width && parseInt(fields.width, 0)
        ? parseInt(fields.width, 0)
        : 204;
    let heightImage =
      fields.height && parseInt(fields.height, 0)
        ? parseInt(fields.height, 0)
        : 257;

    const headerDisable = !fields.boxed ? 'all' : 'none';
    const padEnd = fields.boxed ? padding.large : 0;
    const widthComponent = widthView - 2 * padEnd;
    const ListVendorComponent =
      layout === 'onecolumn'
        ? OneColumnLayout
        : layout === 'twocolumns'
        ? TwoColumnLayout
        : layout === 'threecolumns'
        ? ThreeColumnLayout
        : layout === 'grid'
        ? GridLayout
        : layout === 'list'
        ? ListLayout
        : DefaultLayout;

    return (
      <>
        {fields.disable_heading && (
          <Container disable={headerDisable}>
            <Heading
              title={
                heading.text && heading.text[language]
                  ? heading.text[language]
                  : t('common:text_category')
              }
              style={heading.style && heading.style}
              containerStyle={styles.header}
              subTitle={t('common:text_show_all')}
              onPress={() => navigation.navigate(mainStack.stores)}
            />
          </Container>
        )}
        <Container disable={fields.boxed ? 'none' : 'all'}>
          <ListVendorComponent
            data={data}
            width={widthImage}
            height={heightImage}
            widthComponent={widthComponent}
            typeUrl={typeUrl}
            loading={loading}
            limit={limit}
          />
        </Container>
      </>
    );
  }
}

const DefaultLayout = ({data = [], typeUrl, loading, limit}) => {
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListCarousel
        data={listData}
        renderItem={() => <VendorItemLoading type="two" />}
      />
    );
  }
  return (
    <ListCarousel
      data={data}
      renderItem={item => (
        <VendorItem
          item={item}
          type={'two'}
          typeUrl={typeUrl}
          style={styles.item}
        />
      )}
    />
  );
};

const OneColumnLayout = ({
  data = [],
  width = 100,
  height = 100,
  widthComponent = WIDTH_SCREEN,
  typeUrl,
  loading,
  limit = 4,
}) => {
  const pad = 0;
  const widthImage = widthComponent;
  const heightImage = (widthImage * height) / width;
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListGrid
        data={listData}
        pad={pad}
        renderItem={() => (
          <VendorItemLoading width={widthImage} height={heightImage} />
        )}
      />
    );
  }
  return (
    <ListGrid
      data={data}
      pad={pad}
      renderItem={item => (
        <VendorItem
          item={item}
          width={widthImage}
          height={heightImage}
          typeUrl={typeUrl}
          style={styles.itemGrid}
        />
      )}
    />
  );
};

const TwoColumnLayout = ({
  data = [],
  width = 100,
  height = 100,
  widthComponent = WIDTH_SCREEN,
  typeUrl,
  loading,
  limit = 4,
}) => {
  const pad = 10;
  const widthImage = widthComponent / 1.5;
  const heightImage = (widthImage * height) / width;
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListCarousel
        data={listData}
        pad={pad}
        renderItem={() => (
          <VendorItemLoading width={widthImage} height={heightImage} />
        )}
      />
    );
  }
  return (
    <ListCarousel
      data={data}
      pad={pad}
      renderItem={item => (
        <VendorItem
          item={item}
          width={widthImage}
          height={heightImage}
          typeUrl={typeUrl}
          style={styles.item}
        />
      )}
    />
  );
};

const ThreeColumnLayout = ({
  data = [],
  width = 100,
  height = 100,
  widthComponent = WIDTH_SCREEN,
  typeUrl,
  loading,
  limit,
}) => {
  const pad = 10;
  const widthImage = widthComponent / 2.5;
  const heightImage = (widthImage * height) / width;

  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListCarousel
        data={listData}
        pad={pad}
        renderItem={() => (
          <VendorItemLoading width={widthImage} height={heightImage} />
        )}
      />
    );
  }
  return (
    <ListCarousel
      data={data}
      pad={pad}
      renderItem={item => (
        <VendorItem
          item={item}
          width={widthImage}
          height={heightImage}
          typeUrl={typeUrl}
          style={styles.item}
        />
      )}
    />
  );
};

const GridLayout = ({
  data = [],
  width = 100,
  height = 100,
  widthComponent = WIDTH_SCREEN,
  typeUrl,
  loading,
  limit,
}) => {
  const pad = 10;
  const widthImage = (widthComponent - pad) / 2;
  const heightImage = (widthImage * height) / width;

  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListGrid
        data={listData}
        pad={pad}
        numColumns={2}
        renderItem={() => (
          <VendorItemLoading width={widthImage} height={heightImage} />
        )}
      />
    );
  }
  return (
    <ListGrid
      data={data}
      pad={pad}
      numColumns={2}
      renderItem={item => (
        <VendorItem
          item={item}
          width={widthImage}
          height={heightImage}
          typeUrl={typeUrl}
          style={styles.itemGrid}
        />
      )}
    />
  );
};

const ListLayout = ({
  data = [],
  width = 100,
  height = 100,
  widthComponent = WIDTH_SCREEN,
  typeUrl,
  loading,
  limit,
}) => {
  const pad = 0;
  const widthImage = (widthComponent - pad) / 2;
  const heightImage = (widthImage * height) / width;
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListGrid
        data={listData}
        pad={pad}
        spacing={0}
        renderItem={() => <VendorItemLoading type="one" />}
      />
    );
  }
  return (
    <ListGrid
      data={data}
      pad={pad}
      spacing={0}
      renderItem={(item, index) => (
        <VendorItem
          item={item}
          type="one"
          width={widthImage}
          height={heightImage}
          containerStyle={[
            index === 0 ? styles.itemLayout : null,
            index === data.length - 1 && styles.itemLayoutEnd,
          ]}
          typeUrl={typeUrl}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
  },
  item: {
    flex: 1,
  },
  itemGrid: {
    marginHorizontal: 0,
  },
  itemLayout: {
    paddingTop: 0,
  },
  itemLayoutEnd: {
    borderBottomWidth: 0,
  },
});
const mapStateToProps = state => ({
  language: languageSelector(state),
  location: locationSelector(state),
});

export default compose(
  connect(mapStateToProps),
  withNavigation,
  withTranslation(),
)(Vendors);
