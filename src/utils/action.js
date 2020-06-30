import {Map} from 'immutable';
import {Linking} from 'react-native';
import NavigationServices from './navigation';
import {mainStack, homeTabs} from 'src/config/navigator';

function action(data) {
  if (data && data.type) {
    const {type, id} = data;
    if (type === 'explore') {
      return NavigationServices.navigate(homeTabs.explorer);
    } else if (type === 'categories') {
      return NavigationServices.navigate(homeTabs.shop);
    } else if (type === 'product-sale') {
      return NavigationServices.navigate(mainStack.products, {
        filterBy: Map({
          on_sale: true,
        }),
      });
    } else if (id) {
      switch (type) {
        case 'link-extension':
          return Linking.openURL(id);
        case 'link-webview':
          return NavigationServices.navigate(mainStack.linking_webview, {
            url: id,
          });
        case 'category':
          return NavigationServices.navigate(mainStack.products, {id, type});
        case 'blog':
          return NavigationServices.navigate(mainStack.blog_detail, {id, type});
        case 'product':
          return NavigationServices.navigate(mainStack.product, {id, type});
        default:
          return 0;
      }
    }
  }
}
export default action;
