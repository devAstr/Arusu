import emojiData from '@/models/emojiData.json';

export default class Emoji {

    static get All(): { name: string, catalog: string }[] {
        return emojiData;
    }

    static get Catalog(): { title: string, emoji: string[] }[] {
        return [
            {title: '表情', emoji: Emoji.All.filter(x => x.catalog === '表情').map(x => x.name)},
            {title: '動物', emoji: Emoji.All.filter(x => x.catalog === '動物').map(x => x.name)},
            {title: '文化', emoji: Emoji.All.filter(x => x.catalog === '文化').map(x => x.name)},
            {title: '食物', emoji: Emoji.All.filter(x => x.catalog === '食物').map(x => x.name)},
            {title: '自然', emoji: Emoji.All.filter(x => x.catalog === '自然').map(x => x.name)},
            {title: '姿勢', emoji: Emoji.All.filter(x => x.catalog === '姿勢').map(x => x.name)},
            {title: '其他', emoji: Emoji.All.filter(x => x.catalog === '其他').map(x => x.name)}
        ]
    }
}
