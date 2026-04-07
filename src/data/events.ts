export type Event = {
  id: string;
  name: string;
  nameEn: string;
  date: string;
  time: string;
  location: string;
  locationEn: string;
  participantsMax: number;
  participantsCurrent: number;
  languages: ("ja" | "en")[];
  description: string;
};

export const events: Event[] = [
  {
    id: "1",
    name: "渋谷カフェで英会話",
    nameEn: "English Conversation at Shibuya Café",
    date: "2026-04-05",
    time: "14:00",
    location: "渋谷区カフェスペース",
    locationEn: "Shibuya Café Space",
    participantsMax: 12,
    participantsCurrent: 7,
    languages: ["ja", "en"],
    description: "初心者歓迎！気軽に英語・日本語を練習しましょう。",
  },
  {
    id: "2",
    name: "新宿語学交流ナイト",
    nameEn: "Shinjuku Language Exchange Night",
    date: "2026-04-10",
    time: "19:00",
    location: "新宿区コワーキングスペース",
    locationEn: "Shinjuku Coworking Space",
    participantsMax: 20,
    participantsCurrent: 20,
    languages: ["ja", "en"],
    description: "夜の語学交流イベント。ネイティブスピーカーも多数参加予定。",
  },
  {
    id: "3",
    name: "上野公園ピクニック会話",
    nameEn: "Ueno Park Picnic Conversation",
    date: "2026-04-19",
    time: "11:00",
    location: "上野公園",
    locationEn: "Ueno Park",
    participantsMax: 16,
    participantsCurrent: 4,
    languages: ["ja", "en"],
    description: "公園でリラックスしながら言語交換。お弁当持参歓迎！",
  },
  {
    id: "4",
    name: "表参道アート＆言語ミートアップ",
    nameEn: "Omotesando Art & Language Meetup",
    date: "2026-04-25",
    time: "16:00",
    location: "表参道ギャラリーカフェ",
    locationEn: "Omotesando Gallery Café",
    participantsMax: 10,
    participantsCurrent: 6,
    languages: ["ja", "en"],
    description: "アートを題材に英語・日本語で語り合うユニークなイベント。",
  },
  {
    id: "5",
    name: "池袋オンライン語学交換",
    nameEn: "Ikebukuro Online Language Exchange",
    date: "2026-05-03",
    time: "20:00",
    location: "オンライン (Zoom)",
    locationEn: "Online (Zoom)",
    participantsMax: 30,
    participantsCurrent: 11,
    languages: ["ja", "en"],
    description: "自宅から参加できるオンライン語学交換。全国・海外からも参加OK。",
  },
];
