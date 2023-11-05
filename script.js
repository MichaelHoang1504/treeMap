let game = [];
let svgTreeMap = d3.select('#canvas');
let tooltip = d3.select('.chart')
                .append('div')
                .attr('id','tooltip')
                .style('opacity',0);

let color =  d3.scaleOrdinal().range(['#c6dbef',
             '#9ecae1',
             '#6baed6',
             '#4292c6',
             '#2171b5',
             '#084594',
             '#ffffcc',
             '#d9f0a3',
             '#addd8e',
             '#78c679',
             '#41ab5d',
             '#238443',
             '#fdae6b',
             '#fd8d3c',
             '#f16913',
             '#d94801',
             '#a63603',
             '#7f2704']);

fetch( 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
.then(response=> response.json())
.then(data => {
  game = data;
  let hierarchy = d3.hierarchy(game, d => {
    return d['children']
  }).sum( d => {
    return d['value']
  }).sort((a,b)=>{
    return b['height'] - a['height'] || b['value'] - a['value'];
  })
  let treeMap = d3.treemap().size([1000, 600]);
  treeMap(hierarchy);
  let videoGames = hierarchy.leaves();
  console.log(hierarchy);
  console.log(videoGames);
 let cell = svgTreeMap.selectAll('g')
            .data(videoGames)
            .enter()
            .append('g')
            .attr('transform', d=> {
    return 'translate(' + d['x0'] + ',' + d['y0']+')'
  });
  cell.append('rect')
            .attr('id', function (d) {
        return d['data']['id'];
      })
            .attr('class','tile')
            .attr('fill', (d) => {
    return color( d['data']['category']);
  })
            .attr('data-name', d => {
    return d['data']['name'];
  })
            .attr('data-category', d => {
    return d['data']['category'];
  })
            .attr('data-value', d => {
    return d['data']['value'];
  })
            .attr('width', d=> {
     return d['x1'] - d['x0'];
  })
           .attr('height', d=> {
    return d['y1'] - d['y0'];
  })
  .on('mousemove', function (d) {
        tooltip.style('opacity', 0.9);
        tooltip
          .html(
            'Name: ' +
              d['data']['name']+
              '<br>Category: ' +
              d['data']['category']+
              '<br>Value: ' +
              d['data']['value']
          )
          .attr('data-value', d['data']['value'])
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      });;
  cell.append('text')
      .attr('class', 'tile-text')
      .selectAll('tspan')
      .data(function (d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter()
      .append('tspan')
      .attr('x', 4)
      .attr('y', function (d, i) {
        return 14 + i * 10;
      })
      .text(function (d) {
        return d;
      });
  let categories = videoGames.map(d=>{
    return d['data']['category'];
  }).filter((d,i,arr) => arr.indexOf(d) === i);
  let legendContainer = d3.select('#legend');
  var legend = legendContainer
      .append('g')
      .attr('transform', 'translate(60,10)')
      .selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
        return (
          'translate(' +
          (i % 6) * 150 +
          ',' +
          (Math.floor(i / 6) * 15 +
            10 * Math.floor(i / 6)) +
          ')'
        );
      });

    legend
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('class', 'legend-item')
      .attr('fill', function (d) {
        return color(d);
      });

    legend
      .append('text')
      .attr('x', 18)
      .attr('y', 13)
      .text(function (d) {
        return d;
      });
           
}).catch(e => console.log(e));