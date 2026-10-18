import type { Title, TitleKind } from './types';
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
export function filterTitles(titles: Title[], query: string, kind?: TitleKind): Title[] {
  const term = normalize(query);
  return titles.filter(title => (!kind || title.kind === kind) && normalize([title.name,...title.genres].join(' ')).includes(term));
}
