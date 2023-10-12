import * as d3 from 'd3';
export function setupProjectList(projectList, yogs) {

    yogs.subscribe(
      (activeYogs)=>{
        let projects = projectList.get();
        updateProjects(projects,activeYogs);
      }
    )
  
    projectList.subscribe(projects => {
      let activeYogs = yogs.get();
      updateProjects(projects,activeYogs);
    });

    function updateProjects (projects, activeYogs) {
      projects = projects.filter(
        (p)=>activeYogs[p.year]
      )
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
          .html(p => `${p.title} <span>(${p.year})</span>`)
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
    }
}
