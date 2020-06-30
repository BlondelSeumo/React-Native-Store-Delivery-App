import React from 'react';

import {Dimensions, StyleSheet} from 'react-native';
import Container from 'src/containers/Container';
import ListGrid from '../Vendors/ListGrid';
import ListCarousel from '../Vendors/ListCarousel';

import {productListLayout} from 'src/config/product';
import {padding} from 'src/components/config/spacing';
import ProductItem from 'src/containers/ProductItem';
import ProductItemLoading from 'src/containers/ProductItem/Loading';

const screens = Dimensions.get('window');

const Products = props => {
  const {
    data,
    layout,
    fields,
    widthComponent,
    navigationType,
    loading,
    limit,
  } = props;
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 1) {
    return null;
  }
  let widthImage =
    fields.width && parseInt(fields.width, 0) ? parseInt(fields.width, 0) : 204;
  let heightImage =
    fields.height && parseInt(fields.height, 0)
      ? parseInt(fields.height, 0)
      : 257;

  const typeShow = productListLayout[layout]
    ? productListLayout[layout]
    : productListLayout.onecolumn;

  const padEnd = fields.boxed
    ? typeShow === 'carousel'
      ? padding.large
      : 2 * padding.large
    : 0;

  const widthView = widthComponent - padEnd;

  const disableContainer = !fields.boxed
    ? 'all'
    : typeShow === 'carousel'
    ? 'right'
    : 'none';
  const Component =
    layout === 'twocolumns'
      ? TwoColumnLayout
      : layout === 'threecolumns'
      ? ThreeColumnLayout
      : layout === 'grid'
      ? GridLayout
      : layout === 'list'
      ? ListLayout
      : OneColumnLayout;

  return (
    <Container disable={disableContainer}>
      <Component
        data={data}
        width={widthImage}
        height={heightImage}
        widthView={widthView}
        navigationType={navigationType}
        loading={loading}
        limit={limit}
      />
    </Container>
  );
};

const OneColumnLayout = ({
  data,
  width,
  height,
  widthView,
  navigationType,
  loading,
  limit,
}) => {
  const widthImage = widthView;
  const heightImage = (widthImage * height) / width;
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListGrid
        data={listData}
        renderItem={() => (
          <ProductItemLoading width={widthImage} height={heightImage} />
        )}
      />
    );
  }
  return (
    <ListGrid
      data={data}
      renderItem={item => (
        <ProductItem
          item={item}
          width={widthImage}
          height={heightImage}
          navigationType={navigationType}
          containerStyle={styles.item}
        />
      )}
    />
  );
};

const TwoColumnLayout = ({
  data,
  width,
  height,
  widthView,
  navigationType,
  loading,
  limit,
}) => {
  const widthImage = widthView / 1.5;
  const heightImage = (widthImage * height) / width;
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListCarousel
        data={listData}
        renderItem={() => (
          <ProductItemLoading width={widthImage} height={heightImage} />
        )}
      />
    );
  }
  return (
    <ListCarousel
      data={data}
      renderItem={item => (
        <ProductItem
          item={item}
          width={widthImage}
          height={heightImage}
          navigationType={navigationType}
          containerStyle={styles.item}
        />
      )}
    />
  );
};

const ThreeColumnLayout = ({
  data,
  width,
  height,
  widthView,
  navigationType,
  loading,
  limit,
}) => {
  const widthImage = widthView / 2.5;
  const heightImage = (widthImage * height) / width;

  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListCarousel
        data={listData}
        renderItem={() => (
          <ProductItemLoading width={widthImage} height={heightImage} />
        )}
      />
    );
  }
  return (
    <ListCarousel
      data={data}
      renderItem={item => (
        <ProductItem
          item={item}
          width={widthImage}
          height={heightImage}
          navigationType={navigationType}
          containerStyle={styles.item}
        />
      )}
    />
  );
};

const GridLayout = ({
  data,
  width,
  height,
  widthView,
  navigationType,
  loading,
  limit,
}) => {
  const pad = 10;
  const col = 2;
  const widthImage = (widthView - pad) / 2;
  const heightImage = (widthImage * height) / width;
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListGrid
        data={listData}
        numColumns={col}
        pad={pad}
        renderItem={() => (
          <ProductItemLoading width={widthImage} height={heightImage} />
        )}
      />
    );
  }
  return (
    <ListGrid
      data={data}
      pad={pad}
      numColumns={col}
      renderItem={item => (
        <ProductItem
          item={item}
          width={widthImage}
          height={heightImage}
          navigationType={navigationType}
          containerStyle={styles.item}
        />
      )}
    />
  );
};

const ListLayout = ({data, navigationType, loading, limit}) => {
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ListGrid
        data={listData}
        spacing={0}
        renderItem={() => <ProductItemLoading type="item2" />}
      />
    );
  }
  return (
    <ListGrid
      data={data}
      renderItem={(item, index) => (
        <ProductItem
          item={item}
          type="item2"
          navigationType={navigationType}
          containerStyle={[
            index === 0 ? styles.itemLayout : null,
            index === data.length - 1 && styles.itemLayoutEnd,
          ]}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
  itemLayout: {
    paddingTop: 0,
  },
  itemLayoutEnd: {
    borderBottomWidth: 0,
  },
});
Products.defaultProps = {
  data: [],
  layout: 'onecolumn',
  widthComponent: screens.width,
  loading: false,
  limit: 4,
};

export default Products;
