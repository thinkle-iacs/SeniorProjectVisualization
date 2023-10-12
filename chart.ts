import * as d3 from 'd3';
import {getColor, getTextColor} from './colors';
import {setupProjectList} from './projectList';
import {setupYogFilters} from './yogFilters'
function store (value : any) {
  let __value = value;
  let subscribers = [];  
  const subscribe = (cb) => {
      subscribers.push(cb);
      cb(__value);
  };
  const unsubscribe = (cb) => {
      subscribers = subscribers.filter((f)=>f!=cb);
  };
  const setValue = (v) => {
      __value = v;
      subscribers.forEach(
         (f)=>f(__value) 
      );
    };
  const getValue =  () => {
      return __value;
  }
  const update = (updater) => {
    setValue(updater(__value))
  }
  return {
    get:getValue,set:setValue,subscribe,unsubscribe, update
  }
}

function setupStores (data) {
  let selectedTopic = store(null);
  let selectedCategories = store([]);
  let projectList = store(data.projects);
  let categories = store([]);
  let yogMap = {}
  for (let p of data.projects) {
    yogMap[p.year] = true;
  }
  let yogs = store(yogMap);
  
  selectedTopic.subscribe(
    (t)=>{
      if (t) {
        categories.set(
          data.topicCategoryMap[t]
        );
        projectList.set(data.projects.filter(
          (p)=>p.topics.includes(t)
        ));
      } else {
        categories.set([]);
        projectList.set(data.projects);
      }
    }
  );
  selectedCategories.subscribe(
    (cc)=>{
      console.log('Update categories for',cc)
      if (cc.length) {
         projectList.set(data.projects.filter(
            (p) => cc.every(c => p.categories.includes(c))
         ));
         console.log('List is not',projectList.get().length,'long')
      }
    }
  );
  return {
    selectedTopic,
    selectedCategories: selectedCategories,
    projectList,
    categories,
    yogs
  }
}

function setupBackButton (selectedTopic, selectedCategories) {
  let backButton = d3.select('#back');
  
  selectedTopic.subscribe(
    (t)=>{
      backButton.classed('inactive',!t);
    }
  )
  backButton.on('click', () => {
    if (selectedTopic.get()) {
      selectedTopic.set(null);
    }
  })
}


function setupTitle (selectedTopic) {
  let h1 = d3.select('h1')
  selectedTopic.subscribe(
    (t)=>{
      if (!t) {
        h1.text('Select a Topic!')
        h1.style('--accent','');
      } else {
        h1.text(t)
        h1.style('--accent',getColor(t));
      }
    }
  );  
}

function setupCategoryHeadings(selectedCategories) {
  let container = d3.select('.categories');
  selectedCategories.subscribe((cc) => {
    // Bind the data to our DOM elements
    const categoryHeadings = container.selectAll('.category-heading')
      .data(cc, d => d)
      //.text(d=>d)
      //.style('--accent',d=>d&&getColor(d))
      ;

    // Enter: What to do with new data points
    const newHeadings = categoryHeadings.enter().append('div')
      .attr('class', 'category-heading')      
      .style('--accent',d=>d&&getColor(d))
      .style('--contrast',d=>d&&getTextColor(getColor(d)))
      .text(d => d);

    newHeadings.append('button')
      .text('x')
      .classed('close',true)
      .on('click', (event, d) => {
        // Get the current selected categories
        const currentCategories = selectedCategories.get();

        // Filter out the clicked category
        const newCategories = currentCategories.filter(cat => cat !== d);

        // Update the selected categories
        selectedCategories.set(newCategories);
      });

    // Exit: What to do with data points that no longer exist
    categoryHeadings.exit().remove();
  });
}



export function createChart (data) {
  
  const {selectedTopic, selectedCategories, projectList, categories, yogs} = setupStores(data);
  setupProjectList(projectList,yogs);
  setupBackButton(selectedTopic,selectedCategories);
  setupTitle(selectedTopic)
  setupCategoryHeadings(selectedCategories)
  setupYogFilters(yogs,projectList);
  // Select the container
  const container = d3.select("#visualization-container");  
  const width = +container.style("width").slice(0, -2);
  const height = +container.style("height").slice(0, -2);
  const constraint = width > height && height || width;
  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(data.topics, d => data.projects.filter(p => p.topics.includes(d)).length)])
    .range([constraint/12, constraint/3]);

  const simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .force("collide", d3.forceCollide(d => radiusScale(d.value) + 10))
    .on("tick", ticked);

  yogs.subscribe(
    (yogsActive) => {
      let pp = projectList.get();
      container.selectAll('.bubble')
      .text(d => `${d.name} (${pp.filter(
        p => (p.categories.includes(d.name) || p.topics.includes(d.name)) && yogsActive[p.year]
      ).length})`)
      .classed('inactive',d => !pp.find(
        p => (p.categories.includes(d.name) || p.topics.includes(d.name)) && yogsActive[p.year]
      ))

    }
  )

  function renderBubbles(items) {
    const bubbles = container.selectAll(".bubble")      
      .data(items, d => d.name)
      .classed('active',d=>d.active)
      .text(d => `${d.name} (${d.value})`)
      .style('background',d => getColor(d.name))
      .style('color',d=>getTextColor(getColor(d.name)))
      .style('--bg',d => getColor(d.name))
      .style('--fg',d => getTextColor(getColor(d.name)))
      ;

    bubbles.enter().append("div")
      .attr("class", "bubble")
      .classed('active',d=>d.active)
      .style("width", d => `${radiusScale(d.value) * 2}px`)
      .style("height", d => `${radiusScale(d.value) * 2}px`)
      .on("click", handleBubbleClick)      
      .style('background',d => getColor(d.name))
      .style('color',d=>getTextColor(getColor(d.name)))
      .style('--bg',d => getColor(d.name))
      .style('--fg',d => getTextColor(getColor(d.name)))
      .text(d => `${d.name} (${d.value})`);

    
    bubbles.exit().remove();
    
    simulation.nodes(items).alpha(1).restart();
  }

  function handleBubbleClick(e, item) {
    let topic = selectedTopic.get();
    let cat = selectedCategories.get();
    if (!selectedTopic.get()) {
      selectedTopic.set(item.name);
    } else {
      selectedCategories.update(
        (cc)=>{
          if (cc.includes(item.name)) {
            return cc.filter((v)=>v!=item.name);
          } else {
            return [...cc,item.name]
          }
        }
      );
    }
  }

  function renderTopic (t) {
    if (t) {
      const categoryItems = categories.get().map(c => ({ name: c, value: data.projects.filter(p => p.categories.includes(c)).length }));
      renderBubbles(categoryItems);
    } else {
      const topicItems = data.topics.map(t => ({ name: t, value: data.projects.filter(p => p.topics.includes(t)).length }));
      renderBubbles(topicItems);
    }
  }
  
  function ticked() {
    container.selectAll(".bubble")
      .style("left", d => `${d.x - radiusScale(d.value)}px`)
      .style("top", d => `${d.y - radiusScale(d.value)}px`);
  }

  selectedTopic.subscribe((t) => {
    selectedCategories.set([])
    renderTopic(t);
  });

  selectedCategories.subscribe((cc) => {
    if (!cc.length) {
      renderTopic(selectedTopic.get())
      return
    } else {
      let allCategories = [];
      for (let t in data.topicCategoryMap) {
        for (let c of data.topicCategoryMap[t]) {
          if (!allCategories.includes(c)) {
            allCategories.push(c);
          }
        }
      }
      let remainingCategories = allCategories.filter(
        (c) => data.projects.find(
          (proj)=>{
            let all = [...cc,c];
            return all.every((c)=>proj.categories.includes(c))
          } 
        )
      );
      const categoryItems = remainingCategories.map(c => ({ 
        name: c, 
        value: data.projects.filter(
          (p) => [...cc,c].every(cat => p.categories.includes(cat))
        ).length,
        active : cc.includes(c)
      }));
      renderBubbles(categoryItems);
    }
    
    /*let projects = projectList.get()
    let topic = selectedTopic.get();
    if (!topic) {return}
    d3.selectAll('.bubble')
      .classed('inactive',d=>cc.length&&!projects.find(
        (p)=>{
          let v = p.categories.includes(d.name);
          console.log(d.name,'inactive=>',!v)
          return v;
        }
      ))
      .classed('active',d=>cc.includes(d.name))*/
               
  });

  // Initial render of topics
  const topicItems = data.topics.map(t => ({ name: t, value: data.projects.filter(p => p.topics.includes(t)).length }));
  renderBubbles(topicItems);
  
}