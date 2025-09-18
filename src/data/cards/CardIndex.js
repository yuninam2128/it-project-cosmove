// Temporary compatibility layer for card data
// TODO: Migrate to Clean Architecture
import card1 from './inscard1.png';
import card2 from './inscard2.png';
import card3 from './inscard3.png';
import card4 from './inscard4.png';

export const cardData = [
  {
    id: 1,
    title: '새로운 시도를!',
    description: '평소 미뤄둔 다른 방식으로 접근해보세요. ',
    image: card1
  },
  {
    id: 2,
    title: '작은 행성부터 정복하라',
    description: '오늘은 세부 작업을 정리하기 좋은 날!', 
    image: card2
  },
  {
    id: 3,
    title: '우선순위를 바꿔보자!',
    description: '가장 급한 일부터 처리해보자구~',
    image: card3
  },
  {
    id: 4,
    title: '집중 모드 On',
    description: '한 가지 일에 몰입해 성취감을 느껴보세요. ',
    image: card4
  }
];

export default cardData;