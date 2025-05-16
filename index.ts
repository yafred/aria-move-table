import { h, init, VNode, classModule, attributesModule, eventListenersModule, styleModule } from 'snabbdom';

interface Move {
  turn: number;
  ply: number;
  color: 'white' | 'black';
  san: string;
  advantage: string;
  movetime: string;
}

const renderSan = (san: string) => {
  if (san.charAt(1) !== '-') return san.charAt(0) + '.' + san.substring(1);
};

const patch = init([classModule, attributesModule, eventListenersModule, styleModule]);
const container = document.getElementById('container');

let vnode: VNode;
let dataset: Move[];

function redraw() {
  vnode = patch(vnode || container, h('main', [renderTable1(), renderTable2()]));
}

function renderTable1(): VNode {
  return h('div', [
    h('h2#moveTableLabel1', 'Move table using plain html table'),
    h(
      'table.moves',
      h('tbody', [
        h('tr', [h('th', 'Turn'), h('th', 'Move'), h('th', 'Move time'), h('th', 'White advantage')]),
        ...dataset.map(item => {
          return h('tr', [
            h('td', item.turn),
            h('td', item.color + ' played ' + renderSan(item.san)),
            h('td', item.movetime + ' seconds'),
            h('td', item.advantage),
          ]);
        }),
      ]),
    ),
  ]);
}

function renderTable2(): VNode {
  return h('div', [
    h('h2#moveTableLabel2', 'Move table using html table with aria'),
    h(
      'table.moves',
      {
        attrs: {
          role: 'grid',
          'aria-labelledBy': 'moveTableLabel2',
          'aria-rowcount': dataset.length,
          'aria-colcount': 4,
        },
      },

      h('tbody', [
        h('tr', [
          h('th', { attrs: { 'aria-colindex': 1 } }, 'Turn'),
          h('th', { attrs: { 'aria-colindex': 2 } }, 'Move'),
          h('th', { attrs: { 'aria-colindex': 3 } }, 'Move time'),
          h('th', { attrs: { 'aria-colindex': 4 } }, 'White advantage'),
        ]),
        ...dataset.map(item => {
          return h('tr', { attrs: { 'aria-rowindex': item.ply } }, [
            h('td', { attrs: { tabindex: -1 } }, item.turn),
            h('td', { attrs: { tabindex: -1 } }, item.color + ' played ' + renderSan(item.san)),
            h('td', { attrs: { tabindex: -1 } }, item.movetime + ' seconds'),
            h('td', { attrs: { tabindex: -1 } }, item.advantage),
          ]);
        }),
      ]),
    ),
  ]);
}

fetch('data.json')
  .then(response => response.json())
  .then(json => {
    dataset = json;
    redraw();
  });
