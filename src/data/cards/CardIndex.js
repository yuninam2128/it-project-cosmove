// Temporary compatibility layer for card data
// TODO: Migrate to Clean Architecture
import card1 from './inscard1.png';
import card2 from './inscard2.png';
import card3 from './inscard3.png';
import card4 from './inscard4.png';

export const cardData = [
  {
    id: 1,
    title: '기본 카드',
    description: '기본 카드 설명',
    image: card1
  },
  {
    id: 2,
    title: '특별 카드',
    description: '특별 카드 설명', 
    image: card2
  },
  {
    id: 3,
    title: '추가 카드',
    description: '추가 카드 설명',
    image: card3
  },
  {
    id: 4,
    title: '추가 카드',
    description: '추가 카드 설명',
    image: card4
  }
];

export default cardData;