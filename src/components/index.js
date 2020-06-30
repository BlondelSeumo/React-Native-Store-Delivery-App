import Button from './buttons/Button';
import Input from './input/Input';
import Modal from './modal/Modal';

import Icon from './icons/Icon';
import ListItem from './list/ListItem';
import SocialIcon from './social/SocialIcon';
import Overlay from './overlay/Overlay';
import ThemedView from './themedview/ThemedView';
import SafeAreaView from './safeareaview/SafeAreaView';

import SearchBar from './searchbar/Search';
import Badge from './badge/Badge';
import withBadge from './badge/withBadge';
import CheckBox from './checkbox/CheckBox';
import Divider from './divider/Divider';
import Slider from './slider/Slider';
import ButtonGroup from './buttons/ButtonGroup';
import Image from './image/Image';

import Card from './card/Card';
import Tile from './tile/Tile';
import Avatar from './avatar/Avatar';
import Header from './header/Header';
import PricingCard from './pricing/PricingCard';
import Tooltip from './tooltip/Tooltip';

import Text from './text/Text';
import {
  colors,
  ThemeProvider,
  ThemeConsumer,
  withTheme,
} from 'src/components/config';
import getIconType, {registerCustomIconType} from './helpers/getIconType';
import normalize from './helpers/normalizeText';

import Loading from './Loading';

export {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Input,
  Modal,
  ListItem,
  PricingCard,
  Tooltip,
  SocialIcon,
  Text,
  ThemedView,
  SafeAreaView,
  Divider,
  CheckBox,
  SearchBar,
  Icon,
  colors,
  getIconType,
  registerCustomIconType,
  normalize,
  Tile,
  Slider,
  Avatar,
  Header,
  Overlay,
  ThemeProvider,
  ThemeConsumer,
  withBadge,
  withTheme,
  Image,
  Loading,
};
