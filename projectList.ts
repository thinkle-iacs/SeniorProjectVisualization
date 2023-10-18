import * as d3 from 'd3';
import {getColor,getTextColor} from './colors';
export function setupProjectList(projectList, yogs, selectedCategories) {

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
          .style('opacity', 0)
          .html(p => {
              let categoryCircles = p.categories.map(category => {
                  let color = getColor(category); // Assuming getColor function returns the color for a category.
                  return `<div style="background-color:${color};color:${getTextColor(color)}" class="category-circle" data-category="${category}">${category.substring(0,1)}</div>`;
              }).join('');
              return `${p.title} <span>(${p.year})</span> <span class="cat-container">${categoryCircles}</span>`;
          })
        .each(function(p) {
            d3.select(this).selectAll('.category-circle')
                .on('click', function() {
                    let selectedCategory = d3.select(this).attr('data-category');
                    // Your callback logic for the category here.
                    console.log(`Category ${selectedCategory} clicked.`, d3.select(this));
                    selectedCategories.update(
                      ($sc) => {
                        if (!$sc.includes(selectedCategory)) {
                          $sc.push(selectedCategory);
                        }
                        return $sc
                      }
                    );
                });
        })
          .transition()
          .duration(500)
          .style('opacity', 1);
     /* projectItems.enter().append('li')
          .attr('class', 'project-item')
          .style('opacity',0)
          //.style('transform', 'translateY(-100px)')
          .html(p => `${p.title} <span>(${p.year})</span> FIXME${p.categories}`)
          .transition()
          .duration(500)
          .style('opacity',1)
          //.style('transform', 'translateY(0)');
*/
      projectItems
        .exit()
        .transition()
        .duration(500)
        .style('opacity',0)
        .style('height','1px')
        .remove();
    }
}
