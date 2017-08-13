import * as styles from './App.scss';

const d3 = require('d3');
// let tempNode = null;
// const color = d3.scaleOrdinal(d3.schemeCategory20);
// const paramIgnoreList = ['PATID-NUMBER-disabled'];
// TODO: Further condense paired sets of FOO and A_FOO
// TODO: Ranked column names and checkboxes

/* const intersect = function intersect(a, b) {
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  });
};
*/

export class Clusters {
  render() {
    let div = null;
    this.descriptionEl = document.getElementById('description');

    this.subtitle = document.createElement('div');
    this.subtitle.classList.add(styles.left);
    this.descriptionEl.appendChild(this.subtitle);

    div = document.createElement('div');
    const body = `<svg id='types' class=${styles.svg1}></svg>`;
    div.innerHTML = `${body}`;
    div.classList.add(styles.table);
    this.dom = div;

    return this.dom;
  }

  constructor() {
    console.log('initializing chart');
  }

  update(data) {
    console.log('update');
    this.data = data;
    // store originals for later;
    this.vals = ['AGATCGACCCT',
      'GGAACGACGCT',
      'GGATCGACCCT',
      'CGATAGACGCT',
      'CGATAGACGCT',
      'GGATCGACCCT'];
    const bpCount = this.vals[0].length;
    this.data = new Array(bpCount);
    let i = 0;

    for (i = 0; i < bpCount; i++) {
      this.data[i] = {
        'G': 0,
        'A': 0,
        'C': 0,
        'T': 0,
        'pos': i
      };
    }

    this.vals.forEach( function(sequence) {
      for (i = 0; i < bpCount; i++) {
        this.data[i][sequence[i]]++;
      }
    }.bind(this));

    /* for (i = 0; i < bpCount; i++) {
      const pairs = Object.entries(this.data[i]);
      pairs.sort((x) => x[1]).reverse(); // sort on value
      this.data[i].pairs = pairs.filter((x) => x[1] !== 0);
      this.data[i] = pairs;
      this.data[i].index = i;
    } */

  }

  renderChart() {
    console.log('render');
    const svg = d3.select('svg#types');
    const svgel = svg.node();

    this.width = svgel.clientWidth;
    this.height = svgel.clientHeight;


    // var svg = d3.select('svg'),
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom,
      g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

    const y = d3.scaleLinear()
      .rangeRound([height, 0]);

    const z = d3.scaleOrdinal()
      .range(['#980000', '#008900', '#000088', '#808000']);
    const keys = ['G', 'A', 'T', 'C'];

    // this.data.sort( (a, b) => b.total - a.total );
    x.domain(Object.keys(this.data));
    y.domain([0, this.data.length]).nice();
    z.domain(keys);

    g.append('g')
      .selectAll('g')
      .data(d3.stack().keys(keys)(this.data))
      .enter()
        .append('g')
          .attr('fill', (d) => z(d.key) )
          .attr('char', (d) => d.key)
      .selectAll('text').data( (d) => d )
      .enter().append('text')
      .text(function(d, i, group) {
        // Set string in text elements based on parent attribute for GCTA
        // there might be a better way to do this...
        if (d[0] !== d[1]) {
          return group[i].parentNode.getAttribute('char');
        }
      }
      )
        .style( 'font-family', 'monospace' )
        .style('font-size', x.bandwidth())
      // .attr('x', (d) => x(d.data.pos) )
      // .attr('y', (d) => y(d[1]) )
      .attr('height', (d) => y(d[0]) - y(d[1]) )
      .attr('width', x.bandwidth())
      .attr('transform', function(d, i, group) {
        console.log(d, i, group);
        if (d[0] !== d[1]) {
          return `scale(1,${d[1] - d[0]}) translate(${x(d.data.pos)}, ${y(d[1]) / (d[1] - d[0])})`;
        }
      });

      /*
      this one!
      .append('text').text( (d) => console.log(d) ? d.key : d.key)
        .style( 'text-anchor', 'middle' )
        .style( 'font-family', 'monospace' )
        .attr('x', (d) => console.log(d) ? x(d.index) : x(d.index) )
        .attr('y', (d) => y(d[d.index][1]) )
      /*  .style('font-size', x.bandwidth())
        .attr('transform', (d) => `scale(1,${d[1] - d[0]})`)
      /*      .append('text').text( (d) => d[d.index])

      /* .append('g')
        .attr('fill', (d) => z(d.key) )
      .selectAll('rect')
      .data( (d) => d )
      .enter().append('text').text( (d, i) => d.data.pairs[i][])
        .style( 'text-anchor', 'middle' )
        .style( 'font-family', 'monospace' )
        .attr('x', (d) => x(d.data.index) )
        .attr('y', (d) => y(d[1]) )
        .style('font-size', x.bandwidth())
        .attr('transform', (d) => `scale(1,${d[1]})`)
        /* .attr('height', (d) => y(d[0]) - y(d[1]) )
        .attr('width', x.bandwidth()) */

    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

  }

}
