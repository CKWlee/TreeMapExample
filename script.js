document.addEventListener('DOMContentLoaded', function () {
    const width = 1000;
    const height = 600;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select('#tooltip');

    d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json').then(data => {
        const root = d3.hierarchy(data)
            .eachBefore(d => { d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name; })
            .sum(d => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        d3.treemap()
            .size([width, height])
            .padding(1)
            (root);

        const svg = d3.select('#treemap')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const cell = svg.selectAll('g')
            .data(root.leaves())
            .enter().append('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`);

        cell.append('rect')
            .attr('id', d => d.data.id)
            .attr('class', 'tile')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('data-name', d => d.data.name)
            .attr('data-category', d => d.data.category)
            .attr('data-value', d => d.data.value)
            .attr('fill', d => color(d.data.category))
            .on('mouseover', function (event, d) {
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                    .attr('data-value', d.data.value)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                tooltip.transition().duration(500).style('opacity', 0);
            });

        cell.append('text')
            .attr('class', 'tile-text')
            .selectAll('tspan')
            .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
            .enter().append('tspan')
            .attr('x', 4)
            .attr('y', (d, i) => 13 + i * 10)
            .text(d => d);

        const categories = root.leaves().map(nodes => nodes.data.category).filter((category, index, self) => self.indexOf(category) === index);

        const legend = d3.select('#legend')
            .append('svg')
            .attr('width', width)
            .attr('height', 100);

        const legendItem = legend.selectAll('g')
            .data(categories)
            .enter().append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(${i * 150}, 0)`);

        legendItem.append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', d => color(d));

        legendItem.append('text')
            .attr('x', 25)
            .attr('y', 15)
            .text(d => d);
    });
});
