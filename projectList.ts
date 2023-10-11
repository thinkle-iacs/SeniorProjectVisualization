import * as d3 from 'd3';
export function setupProjectList(projectList) {
    projectList.subscribe(projects => {
      const projectContainer = d3.select('#project-container');         
      projectContainer
        .select('h3')
        .datum(projects.length)
        .text((d)=>`${d} Projects`)
        .enter()
        .append('h3')
        .text(d=>'${d} Projects')
      const projectItems = projectContainer.select('ul').selectAll('.project-item')
          .data(projects, p => p.title);

      projectItems.enter().append('li')
          .attr('class', 'project-item')
          .style('opacity',0)
          //.style('transform', 'translateY(-100px)')
          .text(p => p.title)
          .transition()
          .duration(500)
          .style('opacity',1)
          //.style('transform', 'translateY(0)');

      projectItems
        .exit()
        .transition()
        .duration(500)
        .style('opacity',0)
        .style('height','1px')
        .remove();
    });
}
