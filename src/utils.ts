export function getJapaneseCounter(n: number): string {
  const map: Record<number, string> = {
    1: '一つ目',
    2: '二つ目',
    3: '三つ目',
    4: '四つ目',
    5: '五つ目',
    6: '六つ目',
    7: '七つ目',
    8: '八つ目',
    9: '九つ目',
    10: '十個目',
  };
  return map[n] || `${n}個目`;
}

export interface BodyHint {
  part: string;
  iconName: string;
  functionText: string;
  example: string;
}

export const BODY_HINTS: BodyHint[] = [
  {
    part: '鼻',
    iconName: 'Sparkles',
    functionText: 'においをかぎわける',
    example: '淹れたてのコーヒーやお花の香りをしっかり届けてくれた',
  },
  {
    part: '目',
    iconName: 'Eye',
    functionText: '景色や光を見る',
    example: '今日も文字や好きな景色をはっきりと見せてくれた',
  },
  {
    part: '耳',
    iconName: 'Ear',
    functionText: '音を聴く',
    example: '好きな音楽や人の声をよく聞かせてくれた',
  },
  {
    part: '口・舌',
    iconName: 'Smile',
    functionText: '味を感じる・話す',
    example: '食事のおいしさを味わわせてくれた。言葉を人に伝えてくれた',
  },
  {
    part: '手・指',
    iconName: 'Hand',
    functionText: '物をつかむ・作業する',
    example: 'スマホの操作をしてくれたり，物を持ち上げたりしてくれた',
  },
  {
    part: '足・脚',
    iconName: 'Footprints',
    functionText: '体重を支える・歩く',
    example: '行きたい場所まで運んでくれた',
  },
  {
    part: '心臓',
    iconName: 'Heart',
    functionText: '血液を全身に送り出す',
    example: '眠っているときも一秒も休まずに全身に血液を巡らせてくれた',
  },
  {
    part: '胃・腸',
    iconName: 'Apple',
    functionText: '食べ物を消化・吸収する',
    example: '食べたごはんを消化してくれた',
  },
  {
    part: '肺',
    iconName: 'Wind',
    functionText: '呼吸して酸素を取り込む',
    example: '全身に新鮮な空気を取り込んでくれた',
  },
  {
    part: '皮膚・肌',
    iconName: 'Shield',
    functionText: 'からだを守る・触覚を感じる',
    example: '外の刺激から守ってくれたり，服の生地の心地よさを感じさせてくれた',
  },
  {
    part: '脳・思考',
    iconName: 'Brain',
    functionText: '考えて記憶する',
    example: 'いろいろなことを考え、思い出したり判断したりしてくれた',
  },
  {
    part: '全体',
    iconName: 'Activity',
    functionText: '健康を保つ',
    example: '風邪をひいたり病気になったりせずに一日一日を過ごさせてくれた',
  },
];

export function detectBodyPart(text: string): string {
  const keywords: [RegExp, string][] = [
    [/鼻|におい|匂い|かぎわけ/i, '鼻'],
    [/目|見え|視覚|まぶた|視界/i, '目'],
    [/耳|聴|聞|音/i, '耳'],
    [/口|舌|味|噛|噛み|歯|唇|のど|喉/i, '口・のど'],
    [/手|指|腕|つかむ|握/i, '手・指'],
    [/足|脚|ひざ|歩|走|立ち|踵|かかと/i, '足・脚'],
    [/心臓|胸|鼓動|ハート|血流|脈/i, '心臓'],
    [/胃|腸|お腹|消化|おなか/i, '胃・腸'],
    [/肺|呼吸|息|深呼吸/i, '肺・呼吸'],
    [/皮膚|肌|温もり|ぬくもり|触/i, '皮膚・肌'],
    [/脳|頭|思考|記憶|考え/i, '脳・頭'],
    [/全体|健康/i, '全体'],
  ];

  for (const [regex, label] of keywords) {
    if (regex.test(text)) {
      return label;
    }
  }
  return 'からだの機能';
}
