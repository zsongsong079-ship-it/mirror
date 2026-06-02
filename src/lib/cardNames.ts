const MAJOR_ZH: Record<string, string> = {
  "The Fool": "愚人",
  "The Magician": "魔术师",
  "The High Priestess": "女祭司",
  "The Empress": "女皇",
  "The Emperor": "皇帝",
  "The Hierophant": "教皇",
  "The Lovers": "恋人",
  "The Chariot": "战车",
  Strength: "力量",
  "The Hermit": "隐士",
  "Wheel of Fortune": "命运之轮",
  Justice: "正义",
  "The Hanged Man": "倒吊人",
  Death: "死神",
  Temperance: "节制",
  "The Devil": "恶魔",
  "The Tower": "塔",
  "The Star": "星星",
  "The Moon": "月亮",
  "The Sun": "太阳",
  Judgement: "审判",
  "The World": "世界",
};

const SUIT_ZH: Record<string, string> = {
  wands: "权杖",
  cups: "圣杯",
  swords: "宝剑",
  pentacles: "星币",
};

const RANK_ZH: Record<string, string> = {
  Ace: "首牌",
  "2": "二",
  "3": "三",
  "4": "四",
  "5": "五",
  "6": "六",
  "7": "七",
  "8": "八",
  "9": "九",
  "10": "十",
  Page: "侍从",
  Knight: "骑士",
  Queen: "王后",
  King: "国王",
};

export function getCardNameZh(name: string): string {
  if (MAJOR_ZH[name]) return MAJOR_ZH[name];

  const parts = name.split(" of ");
  if (parts.length === 2) {
    const [rank, suit] = parts;
    const suitZh = SUIT_ZH[suit.toLowerCase()] ?? suit;
    const rankZh = RANK_ZH[rank] ?? rank;
    return `${suitZh}${rankZh}`;
  }

  return name;
}
