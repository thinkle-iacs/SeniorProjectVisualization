import * as d3 from 'd3';

export function setupYogFilters(yogStore, projectList) {


  let container = d3.select('#yog-filters');
  yogStore.subscribe(
    (yogs) => {
      let projects = projectList.get();
      updateYogFilter(yogs, projects);
    }
  );

  projectList.subscribe(
    (projects) => {
      let yogs = yogStore.get();
      updateYogFilter(yogs, projects);
    }
  )

  function updateYogFilter(yogs, projects) {
    let yearValues : {year : number, active : boolean}[] = [];
    for (let y in yogs) {
      yearValues.push(
        {
          year: y,
          active: yogs[y]
        }
      )
    }
    yearValues = yearValues.filter(
      (y)=>projects.find(
        (p)=>p.year==y.year
      )
    );
    // Bind yearValues to data...
    // Create a checkbox input for each year
    // with its value set by the active property...
    let checkboxes = container.selectAll('label')
      .data(yearValues, (yv)=>yv.year)
      .join('label')
      .text((d) => d.year)
      .append('input')
      .attr('type', 'checkbox')
      .property('checked', (d) => d.active)
      .on('change', (event, d) => {
        // Update the yogStore when the checkbox is changed...
        d.active = !d.active;
        yogStore.update((store) => {
          store[d.year] = d.active;
          return store;
        });
      });
  }
}

